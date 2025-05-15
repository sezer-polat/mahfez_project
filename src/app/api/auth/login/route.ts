import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Burada gerçek veritabanı kontrolü yapılacak
    // Şimdilik basit bir kontrol yapıyoruz
    if (email === 'user@example.com' && password === 'password') {
      const token = sign({ email, role: 'user' }, JWT_SECRET, { expiresIn: '1d' });

      cookies().set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 1 gün
      });

      return NextResponse.json({ message: 'Giriş başarılı' });
    }

    return NextResponse.json(
      { message: 'Geçersiz e-posta veya şifre' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 