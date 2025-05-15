import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Stats API: Session kontrolü başlıyor...');
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.log('Stats API: Oturum bulunamadı');
      return NextResponse.json(
        { message: 'Oturum bulunamadı' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      console.log('Stats API: Yetkisiz erişim denemesi', { role: session.user.role });
      return NextResponse.json(
        { message: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    console.log('Stats API: Veritabanı sorguları başlıyor...');

    // Toplam rezervasyon sayısı
    const totalReservations = await prisma.reservation.count();
    console.log('Stats API: Toplam rezervasyon sayısı:', totalReservations);

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

    console.log('Stats API: Tüm veriler başarıyla alındı');

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
    console.error('Stats API: Detaylı hata bilgisi:', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    });
    
    return NextResponse.json(
      { 
        message: 'İstatistikler alınamadı',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        type: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    );
  }
} 