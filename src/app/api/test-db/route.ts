import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Veritabanı bağlantısını test et
    await prisma.$connect();
    
    // Basit bir sorgu yap
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: 'Veritabanı bağlantısı başarılı',
      userCount
    });
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
    return NextResponse.json({
      success: false,
      message: 'Veritabanı bağlantı hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 