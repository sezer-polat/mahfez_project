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
  console.log('Reset password request received:', {
    method: req.method,
    path: req.url,
    timestamp: new Date().toISOString()
  });

  try {
    const { token, email, password } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json(
        { error: 'Token, email ve yeni şifre gereklidir' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Token'ı kontrol et
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Geçersiz veya süresi dolmuş token' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404, headers: corsHeaders }
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

    // Şifreyi güncelle
    const hashedPassword = await hashPassword(password);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Kullanılmış token'ı sil
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });

    return NextResponse.json({
      message: 'Şifreniz başarıyla güncellendi',
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error);
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