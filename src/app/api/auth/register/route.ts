import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, validatePassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Register request body:', body);

    const { email, password, name } = body;

    if (!email || !password || !name) {
      return new NextResponse(
        JSON.stringify({ error: 'Email, şifre ve isim gereklidir' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // E-posta kontrolü
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return new NextResponse(
          JSON.stringify({ error: 'Bu e-posta adresi zaten kullanılıyor' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      return new NextResponse(
        JSON.stringify({ error: 'Veritabanı bağlantı hatası' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Şifre karmaşıklığı kontrolü
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return new NextResponse(
        JSON.stringify({ error: passwordValidation.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Şifreyi hashle
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
    } catch (hashError) {
      console.error('Password hash error:', hashError);
      return new NextResponse(
        JSON.stringify({ error: 'Şifre işleme hatası' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Kullanıcıyı oluştur
    try {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'USER',
        },
      });

      console.log('Created user:', { ...user, password: '[REDACTED]' });

      return new NextResponse(
        JSON.stringify({ message: 'Kullanıcı başarıyla oluşturuldu' }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (createError) {
      console.error('User creation error:', createError);
      return new NextResponse(
        JSON.stringify({ error: 'Kullanıcı oluşturma hatası' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Bir hata oluştu: ' + (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 