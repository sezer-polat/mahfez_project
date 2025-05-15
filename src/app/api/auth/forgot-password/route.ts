import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/mail';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: Request) {
  console.log('Forgot password request received:', {
    method: request.method,
    path: request.url,
    timestamp: new Date().toISOString()
  });

  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { error: 'E-posta gereklidir' },
        { status: 400, headers: corsHeaders }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Güvenlik için her zaman başarılı yanıt dön
      return NextResponse.json(
        { message: 'Eğer bu e-posta sistemde varsa, şifre sıfırlama bağlantısı gönderildi.' },
        { headers: corsHeaders }
      );
    }

    // Token oluştur
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 dakika geçerli

    // Tokenı kaydet
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // E-posta gönder
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/sifre-yenile?token=${token}&email=${encodeURIComponent(email)}`;
    await sendMail({
      to: email,
      subject: 'Şifre Sıfırlama Talebi',
      html: `<p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Bu bağlantı 30 dakika geçerlidir.</p>`
    });

    return NextResponse.json(
      { message: 'Eğer bu e-posta sistemde varsa, şifre sıfırlama bağlantısı gönderildi.' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Şifre sıfırlama isteği hatası:', error);
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