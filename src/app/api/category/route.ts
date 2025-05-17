import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import redis from '@/lib/redis';
import { Pool } from 'pg';

const prisma = new PrismaClient();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const dynamic = 'force-dynamic';

// Kategorileri listele ve yeni kategori ekle
export async function GET() {
  let data: any = await redis.get('categories');
  if (data) {
    return NextResponse.json(JSON.parse(data));
  }

  const result = await pool.query('SELECT * FROM "Category" ORDER BY "createdAt" DESC');
  data = result.rows;

  await redis.set('categories', JSON.stringify(data), 'EX', 3600);

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { name, description } = data;
  if (!name) {
    return NextResponse.json({ error: 'Kategori adı zorunludur.' }, { status: 400 });
  }
  const category = await prisma.category.create({
    data: { 
      name, 
      description,
      updatedAt: new Date()
    },
  });
  return NextResponse.json(category, { status: 201 });
} 