import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import redis from '@/lib/redis';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const dynamic = 'force-dynamic';

// GET /api/bookings - Kullanıcının rezervasyonlarını getir
export async function GET() {
  let data: any = await redis.get('bookings');
  if (data) {
    return NextResponse.json(JSON.parse(data));
  }

  const result = await pool.query('SELECT * FROM "Booking" ORDER BY "createdAt" DESC');
  data = result.rows;

  await redis.set('bookings', JSON.stringify(data), 'EX', 3600);

  return NextResponse.json(data);
}

// POST /api/bookings - Yeni rezervasyon oluştur
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { tourId, numberOfPeople, notes } = body;

    // Tur bilgilerini al
    const tourResult = await pool.query('SELECT * FROM "Tour" WHERE id = $1', [tourId]);
    const tour = tourResult.rows[0];

    if (!tour) {
      return new NextResponse('Tur bulunamadı', { status: 404 });
    }

    // Kapasite kontrolü
    if (tour.available < numberOfPeople) {
      return new NextResponse('Yetersiz kapasite', { status: 400 });
    }

    // Transaction başlat
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Tur kapasitesini güncelle
      await client.query('UPDATE "Tour" SET available = available - $1 WHERE id = $2', [numberOfPeople, tourId]);
      // Booking oluştur
      const bookingResult = await client.query(
        'INSERT INTO "Booking" (userId, tourId, numberOfPeople, totalPrice, notes, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [session.user.id, tourId, numberOfPeople, tour.price * numberOfPeople, notes, 'PENDING']
      );
      await client.query('COMMIT');
      // Cache'i temizle
      await redis.del('bookings');
      return NextResponse.json(bookingResult.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Booking error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 