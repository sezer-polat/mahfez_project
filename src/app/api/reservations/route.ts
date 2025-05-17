import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import redis from '@/lib/redis';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
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
      numberOfPeople,
    } = body;

    // Eksik alan kontrolü
    if (!tourId || !firstName || !lastName || !email || !phone || !address || !city || !country || !numberOfPeople) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurmalısınız.' },
        { status: 400 }
      );
    }

    // Turu kontrol et
    const tourResult = await pool.query('SELECT * FROM "Tour" WHERE id = $1', [tourId]);
    const tour = tourResult.rows[0];

    if (!tour) {
      return NextResponse.json(
        { error: 'Tur bulunamadı' },
        { status: 404 }
      );
    }

    // Kontenjan kontrolü
    if (tour.available < numberOfPeople) {
      return NextResponse.json(
        { error: 'Yeterli kontenjan bulunmamaktadır' },
        { status: 400 }
      );
    }

    // Transaction başlat
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Rezervasyonu oluştur
      const reservationResult = await client.query(
        'INSERT INTO "Reservation" (tourId, firstName, lastName, email, phone, address, city, country, specialRequests, numberOfPeople, status, totalPrice) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',
        [tourId, firstName, lastName, email, phone, address, city, country, specialRequests, numberOfPeople, 'PENDING', tour.price * numberOfPeople]
      );
      // Tur kontenjanını güncelle
      await client.query('UPDATE "Tour" SET available = available - $1 WHERE id = $2', [numberOfPeople, tourId]);
      await client.query('COMMIT');
      // Cache'i temizle
      await redis.del('reservations');
      return NextResponse.json(reservationResult.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Rezervasyon oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Rezervasyon oluşturulamadı' },
      { status: 500 }
    );
  }
}

export async function GET() {
  let data: any = await redis.get('reservations');
  if (data) {
    return NextResponse.json(JSON.parse(data));
  }

  const result = await pool.query('SELECT * FROM "Reservation" ORDER BY "createdAt" DESC');
  data = result.rows;

  await redis.set('reservations', JSON.stringify(data), 'EX', 3600);

  return NextResponse.json(data);
} 