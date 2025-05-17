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

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session); // Debug için

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('tourId');

    if (!tourId) {
      return NextResponse.json({ error: 'Tour ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.favorite.delete({
      where: {
        userId_tourId: {
          userId: user.id,
          tourId: tourId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 