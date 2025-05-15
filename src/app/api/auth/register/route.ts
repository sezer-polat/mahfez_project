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
      return NextResponse.json(
        { error: 'Email, şifre ve isim gereklidir' },
        { status: 400 }
      );
    }

    // E-posta kontrolü
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Bu e-posta adresi zaten kullanılıyor' },
          { status: 400 }
        );
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Veritabanı bağlantı hatası' },
        { status: 500 }
      );
    }

    // Şifre karmaşıklığı kontrolü
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
    } catch (hashError) {
      console.error('Password hash error:', hashError);
      return NextResponse.json(
        { error: 'Şifre işleme hatası' },
        { status: 500 }
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

      return NextResponse.json(
        { message: 'Kullanıcı başarıyla oluşturuldu' },
        { status: 201 }
      );
    } catch (createError) {
      console.error('User creation error:', createError);
      return NextResponse.json(
        { error: 'Kullanıcı oluşturma hatası' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu: ' + (error as Error).message },
      { status: 500 }
    );
  }
} 