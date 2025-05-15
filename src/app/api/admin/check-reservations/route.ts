import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    // Tüm rezervasyonları getir
    const reservations = await prisma.reservation.findMany({
      include: {
        tour: {
          select: {
            title: true,
            image: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    // Tur sayısını kontrol et
    const tourCount = await prisma.tour.count();

    return NextResponse.json({
      reservationCount: reservations.length,
      tourCount,
      reservations,
    });
  } catch (error) {
    console.error('Rezervasyon kontrolü hatası:', error);
    return NextResponse.json(
      { message: 'Rezervasyonlar kontrol edilemedi' },
      { status: 500 }
    );
  }
} 