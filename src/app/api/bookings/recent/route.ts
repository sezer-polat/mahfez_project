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
      include: {
        tour: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3, // En son 3 rezervasyonu göster
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