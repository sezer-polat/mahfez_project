import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const dynamic = 'force-dynamic';

// GET: Tüm kullanıcıları getir (admin için)
export async function GET() {
  let data: any = await redis.get('users');
  if (data) {
    return NextResponse.json(JSON.parse(data));
  }

  const result = await pool.query('SELECT id, email, name, role, createdAt, updatedAt FROM "User" ORDER BY "createdAt" DESC');
  data = result.rows;

  await redis.set('users', JSON.stringify(data), 'EX', 3600);

  return NextResponse.json(data);
}

// POST: Yeni kullanıcı oluştur
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, name, role } = data;

    // Email kontrolü
    const existingUser = await pool.query('SELECT id FROM "User" WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await pool.query(
      'INSERT INTO "User" (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, createdAt, updatedAt',
      [email, hashedPassword, name, role || 'USER']
    );
    const user = insertResult.rows[0];

    // Cache'i temizle
    await redis.del('users');

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Kullanıcı oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 