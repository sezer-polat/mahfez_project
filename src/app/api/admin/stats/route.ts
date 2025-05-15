import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    // Toplam rezervasyon sayısı
    const totalReservations = await prisma.reservation.count();

    // Durumlara göre rezervasyon sayıları
    const pendingReservations = await prisma.reservation.count({
      where: { status: 'PENDING' }
    });

    const confirmedReservations = await prisma.reservation.count({
      where: { status: 'CONFIRMED' }
    });

    const cancelledReservations = await prisma.reservation.count({
      where: { status: 'CANCELLED' }
    });

    // Toplam gelir
    const totalRevenue = await prisma.reservation.aggregate({
      _sum: {
        totalPrice: true
      },
      where: {
        status: 'CONFIRMED'
      }
    });

    // Son 7 gündeki rezervasyonlar
    const lastWeekReservations = await prisma.reservation.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Son rezervasyonlar
    const recentBookings = await prisma.reservation.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
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

    return NextResponse.json({
      totalReservations,
      pendingReservations,
      confirmedReservations,
      cancelledReservations,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      lastWeekReservations,
      recentBookings
    });
  } catch (error) {
    console.error('İstatistik hatası:', error);
    return NextResponse.json(
      { message: 'İstatistikler alınamadı' },
      { status: 500 }
    );
  }
} 