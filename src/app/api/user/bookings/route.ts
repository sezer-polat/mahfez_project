import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
        status: 'CONFIRMED'
      },
      select: {
        id: true,
        tour: {
          select: {
            title: true,
            startDate: true,
            endDate: true,
            price: true
          }
        },
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const body = await request.json();
    const { tourId } = body;

    if (!tourId) {
      return new NextResponse('Tour ID is required', { status: 400 });
    }

    const tour = await prisma.tour.findUnique({
      where: {
        id: tourId
      },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    if (!tour) {
      return new NextResponse('Tour not found', { status: 404 });
    }

    if (tour._count.bookings >= tour.capacity) {
      return new NextResponse('Tour is fully booked', { status: 400 });
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: user.id,
        tourId: tourId,
        status: {
          in: ['CONFIRMED']
        }
      }
    });

    if (existingBooking) {
      return new NextResponse('You already have a booking for this tour', { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        tourId: tourId,
        status: 'CONFIRMED',
        numberOfPeople: 1,
        totalPrice: tour.price
      },
      include: {
        tour: {
          select: {
            title: true,
            startDate: true,
            endDate: true,
            price: true
          }
        }
      }
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Booking creation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 