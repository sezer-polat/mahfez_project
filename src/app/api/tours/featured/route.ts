import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/tours/featured - Öne çıkan turları getir
export async function GET() {
  try {
    const featuredTours = await prisma.tour.findMany({
      where: {
        isActive: true,
        startDate: {
          gt: new Date(), // Başlangıç tarihi bugünden sonra olan turlar
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        startDate: 'asc',
      },
      take: 6, // En fazla 6 tur göster
    });

    return NextResponse.json(featuredTours);
  } catch (error) {
    console.error('Öne çıkan turlar getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Öne çıkan turlar getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 