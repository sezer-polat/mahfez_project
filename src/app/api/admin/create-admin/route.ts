import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Admin kullanıcısı oluştur
export async function GET() {
  try {
    const email = 'admin@mahfez.com';
    const password = 'Admin123!';
    const name = 'Admin';

    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Admin kullanıcısı zaten mevcut' },
        { status: 200 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await hashPassword(password);

    // Admin kullanıcısını oluştur
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    return NextResponse.json(
      { 
        message: 'Admin kullanıcısı başarıyla oluşturuldu',
        email: user.email,
        password: 'Admin123!' // Şifreyi sadece ilk oluşturmada göster
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST: Özel admin kullanıcısı oluştur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await hashPassword(password);

    // Admin kullanıcısını oluştur
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    return NextResponse.json(
      { message: 'Admin kullanıcısı başarıyla oluşturuldu' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 