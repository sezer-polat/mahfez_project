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

  const result = await pool.query('SELECT * FROM "Tour" WHERE "isActive" = true ORDER BY "createdAt" DESC LIMIT 3');
  data = result.rows;

  await redis.set('featuredTours', JSON.stringify(data), 'EX', 3600);

  return NextResponse.json(data);
} 