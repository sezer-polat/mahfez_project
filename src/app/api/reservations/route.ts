import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import redis from '@/lib/redis';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Giriş yapmalısınız.' }, { status: 401 });
    }
    const body = await request.json();
    const {
      tourId,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      specialRequests,
      numberOfPeople: rawNumberOfPeople,
    } = body;

    const userId = session.user.id;
    const numberOfPeople = Number(rawNumberOfPeople);

    if (
      !tourId ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !country ||
      isNaN(numberOfPeople) ||
      numberOfPeople < 1 ||
      !userId
    ) {
      return NextResponse.json(
        { error: 'Tüm alanları eksiksiz ve doğru doldurmalısınız.' },
        { status: 400 }
      );
    }

    // Gelen veriyi logla
    console.log('Rezervasyon body:', body);

    // Turu kontrol et
    const tourResult = await pool.query('SELECT * FROM "Tour" WHERE id = $1', [tourId]);
    const tour = tourResult.rows[0];

    if (!tour) {
      return NextResponse.json(
        { error: 'Tur bulunamadı' },
        { status: 404 }
      );
    }

    if (tour.available < numberOfPeople) {
      return NextResponse.json(
        { error: 'Yeterli kontenjan bulunmamaktadır' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const now = new Date();
      const reservationResult = await client.query(
        'INSERT INTO "Reservation" ("tourId", "userId", "firstName", "lastName", "email", "phone", "address", "city", "country", "specialRequests", "numberOfPeople", "status", "totalPrice", "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *',
        [tourId, userId, firstName, lastName, email, phone, address, city, country, specialRequests, numberOfPeople, 'PENDING', tour.price * numberOfPeople, now, now]
      );
      await client.query('UPDATE "Tour" SET available = available - $1 WHERE id = $2', [numberOfPeople, tourId]);
      await client.query('COMMIT');
      await redis.del('reservations');
      return NextResponse.json(reservationResult.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Rezervasyon oluşturma hatası:', error, error.stack);
      return NextResponse.json(
        { error: 'Rezervasyon oluşturulamadı', details: error.message },
        { status: 500 }
      );
    } else {
      console.error('Rezervasyon oluşturma hatası:', error);
      return NextResponse.json(
        { error: 'Rezervasyon oluşturulamadı', details: String(error) },
        { status: 500 }
      );
    }
  }
}

export async function GET() {
  let data: any = await redis.get('reservations');
  if (data) {
    // Cache'ten gelen veri eski formatta olabilir, dönüştür
    let parsed = JSON.parse(data);
    // Eğer ilk elemanda tour yoksa, dönüştür
    if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].tour) {
      // Tur bilgilerini topluca çekmek için id'leri topla
      const tourIds = [...new Set(parsed.map(r => r.tourId))];
      const { rows: tours } = await pool.query(
        `SELECT id, title, image, "startDate", "endDate" FROM "Tour" WHERE id = ANY($1)`,
        [tourIds]
      );
      const tourMap = Object.fromEntries(tours.map(t => [t.id, t]));
      parsed = parsed.map(r => ({
        ...r,
        tour: tourMap[r.tourId]
          ? {
              title: tourMap[r.tourId].title,
              image: tourMap[r.tourId].image,
              startDate: tourMap[r.tourId].startDate,
              endDate: tourMap[r.tourId].endDate,
            }
          : null,
      }));
    }
    return NextResponse.json(parsed);
  }

  // Rezervasyonları tur bilgisiyle birlikte çek
  const result = await pool.query(`
    SELECT r.*, t.title as tour_title, t.image as tour_image, t."startDate" as tour_startDate, t."endDate" as tour_endDate
    FROM "Reservation" r
    LEFT JOIN "Tour" t ON r."tourId" = t.id
    ORDER BY r."createdAt" DESC
  `);
  data = result.rows.map(row => ({
    ...row,
    tour: {
      title: row.tour_title,
      image: row.tour_image,
      startDate: row.tour_startDate,
      endDate: row.tour_endDate,
    }
  }));

  await redis.set('reservations', JSON.stringify(data), 'EX', 3600);

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const { status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 });
    }
    // Sadece status güncelle
    const result = await pool.query(
      'UPDATE "Reservation" SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Rezervasyon bulunamadı' }, { status: 404 });
    }
    // Cache'i temizle
    await redis.del('reservations');
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Rezervasyon güncelleme hatası:', error);
    return NextResponse.json({ error: 'Rezervasyon güncellenemedi', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 