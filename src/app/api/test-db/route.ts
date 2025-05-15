import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Veritabanı bağlantısını test et
    await prisma.$connect();
    
    // Tüm tabloları listele
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    return NextResponse.json({
      success: true,
      message: 'Veritabanı bağlantısı başarılı',
      tables
    });
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
    return NextResponse.json({
      success: false,
      message: 'Veritabanı bağlantı hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 