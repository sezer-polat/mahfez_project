import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { Pool } from 'pg';

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
  const insertResult = await pool.query(
    'INSERT INTO "Category" (name, description, "updatedAt") VALUES ($1, $2, NOW()) RETURNING *',
    [name, description]
  );
  const category = insertResult.rows[0];
  // Kategoriler güncellendi, güncel veriyi Redis'e yaz
  const allCategories = await pool.query('SELECT * FROM "Category" ORDER BY "createdAt" DESC');
  const categoriesData = allCategories.rows;
  await redis.set('categories', JSON.stringify(categoriesData), 'EX', 3600);
  return NextResponse.json(category, { status: 201 });
}

// Eğer bir DELETE fonksiyonu varsa, kategori silindikten sonra:
// ... mevcut kod ...
  // Kategoriler güncellendi, güncel veriyi Redis'e yaz
  const allCategories = await pool.query('SELECT * FROM "Category" ORDER BY "createdAt" DESC');
  const categoriesData = allCategories.rows;
  await redis.set('categories', JSON.stringify(categoriesData), 'EX', 3600);
// ... mevcut kod ... 

// Eğer kategori silme (DELETE) fonksiyonu eklenirse, aşağıdaki gibi güncel cache yazılmalı:
//
// export async function DELETE(req: NextRequest) {
//   // ... silme işlemi ...
//   const allCategories = await pool.query('SELECT * FROM "Category" ORDER BY "createdAt" DESC');
//   const categoriesData = allCategories.rows;
//   await redis.set('categories', JSON.stringify(categoriesData), 'EX', 3600);
//   return NextResponse.json({ success: true });
// } 