import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/bookings/recent - Son rezervasyonları getir
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const recentBookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3, // En son 3 rezervasyonu göster
      select: {
        id: true,
        firstName: true,
        lastName: true,
        numberOfPeople: true,
        totalPrice: true,
        status: true,
        createdAt: true,
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

    return NextResponse.json(recentBookings);
  } catch (error) {
    console.error('Son rezervasyonlar getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Son rezervasyonlar getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 