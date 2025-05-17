import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { Pool } from 'pg';
import { customAlphabet } from 'nanoid';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const cuid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 24);

export const dynamic = 'force-dynamic';

// GET: Tüm favorileri getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let data: any = await redis.get('favorites');
    if (data) {
      let parsed = JSON.parse(data);
      if (userId) {
        parsed = parsed.filter((fav: any) => fav.userId === userId);
      }
      return NextResponse.json(parsed);
    }

    // Favorilerle birlikte ilgili turun ve kategorisinin adını çek
    const result = await pool.query(`
      SELECT f.*, t.title as tour_title, t.image as tour_image, t.price as tour_price, t."startDate" as tour_startDate, t."endDate" as tour_endDate, c.name as category_name
      FROM "Favorite" f
      LEFT JOIN "Tour" t ON f."tourId" = t.id
      LEFT JOIN "Category" c ON t."categoryId" = c.id
      ORDER BY f."createdAt" DESC
    `);
    data = result.rows
      .filter(row => row.tour_title) // Sadece başlık zorunlu
      .map(row => ({
        ...row,
        tour: {
          id: row.tourId,
          title: row.tour_title,
          image: row.tour_image || '/images/default-tour.jpg',
          price: row.tour_price,
          startDate: row.tour_startDate,
          endDate: row.tour_endDate,
          category: row.category_name ? { name: row.category_name } : null,
        },
      }));

    if (userId) {
      data = data.filter((fav: any) => fav.userId === userId);
    }

    await redis.set('favorites', JSON.stringify(data), 'EX', 3600);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Favoriler GET hatası:', error);
    return NextResponse.json(
      { error: 'Favoriler yüklenirken bir hata oluştu', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST: Yeni favori ekle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, tourId } = body;
    console.log('Favori ekleme:', { userId, tourId });
    const now = new Date();
    const id = cuid();

    // Aynı favori var mı kontrol et
    const existing = await pool.query('SELECT "id" FROM "Favorite" WHERE "userId" = $1 AND "tourId" = $2', [userId, tourId]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Bu tur zaten favorilerde' },
        { status: 400 }
      );
    }

    const insertResult = await pool.query(
      'INSERT INTO "Favorite" ("id", "userId", "tourId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, userId, tourId, now, now]
    );
    const favorite = insertResult.rows[0];

    // Favoriler güncellendi, güncel veriyi Redis'e yaz
    const allFavorites = await pool.query(`
      SELECT f.*, t.title as tour_title, t.image as tour_image, t.price as tour_price, t."startDate" as tour_startDate, t."endDate" as tour_endDate, c.name as category_name
      FROM "Favorite" f
      LEFT JOIN "Tour" t ON f."tourId" = t.id
      LEFT JOIN "Category" c ON t."categoryId" = c.id
      ORDER BY f."createdAt" DESC
    `);
    let data = allFavorites.rows
      .filter(row => row.tour_title)
      .map(row => ({
        ...row,
        tour: {
          id: row.tourId,
          title: row.tour_title,
          image: row.tour_image || '/images/default-tour.jpg',
          price: row.tour_price,
          startDate: row.tour_startDate,
          endDate: row.tour_endDate,
          category: row.category_name ? { name: row.category_name } : null,
        },
      }));
    await redis.set('favorites', JSON.stringify(data), 'EX', 3600);

    return NextResponse.json(favorite);
  } catch (error) {
    return NextResponse.json(
      { error: 'Favori eklenirken bir hata oluştu', details: error instanceof Error ? error.message : String(error) },
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
      'DELETE FROM "Favorite" WHERE "userId" = $1 AND "tourId" = $2 RETURNING *',
      [userId, tourId]
    );

    // Favoriler güncellendi, güncel veriyi Redis'e yaz
    const allFavorites = await pool.query(`
      SELECT f.*, t.title as tour_title, t.image as tour_image, t.price as tour_price, t."startDate" as tour_startDate, t."endDate" as tour_endDate, c.name as category_name
      FROM "Favorite" f
      LEFT JOIN "Tour" t ON f."tourId" = t.id
      LEFT JOIN "Category" c ON t."categoryId" = c.id
      ORDER BY f."createdAt" DESC
    `);
    let data = allFavorites.rows
      .filter(row => row.tour_title)
      .map(row => ({
        ...row,
        tour: {
          id: row.tourId,
          title: row.tour_title,
          image: row.tour_image || '/images/default-tour.jpg',
          price: row.tour_price,
          startDate: row.tour_startDate,
          endDate: row.tour_endDate,
          category: row.category_name ? { name: row.category_name } : null,
        },
      }));
    await redis.set('favorites', JSON.stringify(data), 'EX', 3600);

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: 'Favori bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Favori silinirken bir hata oluştu' }, { status: 500 });
  }
} 