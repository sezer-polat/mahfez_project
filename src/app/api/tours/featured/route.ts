import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const dynamic = 'force-dynamic';

// GET /api/tours/featured - Öne çıkan turları getir
export async function GET() {
  let data: any = await redis.get('featuredTours');
  if (data) {
    return NextResponse.json(JSON.parse(data));
  }

  // Kategori adıyla birlikte öne çıkan turları çek
  const result = await pool.query(`
    SELECT t.*, c.name as category_name
    FROM "Tour" t
    LEFT JOIN "Category" c ON t."categoryId" = c.id
    WHERE t."isActive" = true
    ORDER BY t."createdAt" DESC
    LIMIT 3
  `);
  data = result.rows.map(row => ({
    ...row,
    category: { name: row.category_name },
  }));

  await redis.set('featuredTours', JSON.stringify(data), 'EX', 3600);

  return NextResponse.json(data);
} 