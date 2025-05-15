import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/bookings - Kullanıcının rezervasyonlarını getir
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        tour: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    const total = await prisma.booking.count({
      where: {
        userId: session.user.id
      }
    });

    return NextResponse.json({
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/bookings - Yeni rezervasyon oluştur
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { tourId, participants, notes } = body;

    // Tur bilgilerini al
    const tour = await prisma.tour.findUnique({
      where: { id: tourId }
    });

    if (!tour) {
      return new NextResponse('Tur bulunamadı', { status: 404 });
    }

    // Kapasite kontrolü
    if (tour.available < participants) {
      return new NextResponse('Yetersiz kapasite', { status: 400 });
    }

    // Booking oluştur
    const booking = await prisma.$transaction(async (tx) => {
      // Tur kapasitesini güncelle
      const updatedTour = await tx.tour.update({
        where: { id: tourId },
        data: {
          available: {
            decrement: participants
          }
        }
      });

      // Booking oluştur
      const newBooking = await tx.booking.create({
        data: {
          userId: session.user.id,
          tourId,
          participants,
          totalPrice: tour.price * participants,
          notes,
          status: 'ACTIVE'
        }
      });

      return newBooking;
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 