import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const dynamic = 'force-dynamic';

// GET: Tüm favorileri getir
export async function GET() {
  let data: any = await redis.get('favorites');
  if (data) {
    return NextResponse.json(JSON.parse(data));
  }

  const result = await pool.query('SELECT * FROM "Favorite" ORDER BY "createdAt" DESC');
  data = result.rows;

  await redis.set('favorites', JSON.stringify(data), 'EX', 3600);

  return NextResponse.json(data);
}

// POST: Yeni favori ekle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, tourId } = body;

    // Aynı favori var mı kontrol et
    const existing = await pool.query('SELECT id FROM "Favorite" WHERE userId = $1 AND tourId = $2', [userId, tourId]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Bu tur zaten favorilerde' },
        { status: 400 }
      );
    }

    const insertResult = await pool.query(
      'INSERT INTO "Favorite" (userId, tourId) VALUES ($1, $2) RETURNING *',
      [userId, tourId]
    );
    const favorite = insertResult.rows[0];

    // Cache'i temizle
    await redis.del('favorites');

    return NextResponse.json(favorite);
  } catch (error) {
    return NextResponse.json(
      { error: 'Favori eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE: Favori sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const tourId = searchParams.get('tourId');

    if (!userId || !tourId) {
      return NextResponse.json({ error: 'userId ve tourId zorunludur' }, { status: 400 });
    }

    const deleteResult = await pool.query(
      'DELETE FROM "Favorite" WHERE userId = $1 AND tourId = $2 RETURNING *',
      [userId, tourId]
    );

    // Cache'i temizle
    await redis.del('favorites');

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: 'Favori bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Favori silinirken bir hata oluştu' }, { status: 500 });
  }
} 