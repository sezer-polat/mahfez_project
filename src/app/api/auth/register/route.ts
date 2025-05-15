import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, validatePassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(req: Request) {
  console.log('Register request received:', {
    method: req.method,
    path: req.url,
    timestamp: new Date().toISOString()
  });

  try {
    const body = await req.json();
    console.log('Register request body:', body);

    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, şifre ve isim gereklidir' },
        { status: 400, headers: corsHeaders }
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
          { status: 400, headers: corsHeaders }
        );
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { 
          error: 'Veritabanı bağlantı hatası',
          details: dbError instanceof Error ? dbError.message : 'Bilinmeyen veritabanı hatası'
        },
        { status: 500, headers: corsHeaders }
      );
    }

    // Şifre karmaşıklığı kontrolü
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400, headers: corsHeaders }
      );
    }

    // Şifreyi hashle
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
    } catch (hashError) {
      console.error('Password hash error:', hashError);
      return NextResponse.json(
        { 
          error: 'Şifre işleme hatası',
          details: hashError instanceof Error ? hashError.message : 'Bilinmeyen hash hatası'
        },
        { status: 500, headers: corsHeaders }
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
        { status: 201, headers: corsHeaders }
      );
    } catch (createError) {
      console.error('User creation error:', createError);
      return NextResponse.json(
        { 
          error: 'Kullanıcı oluşturma hatası',
          details: createError instanceof Error ? createError.message : 'Bilinmeyen oluşturma hatası'
        },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      { 
        error: 'Bir hata oluştu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
} 