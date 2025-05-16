import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tourId,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      specialRequests,
      numberOfPeople,
    } = body;

    // Turu kontrol et
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      return NextResponse.json(
        { error: 'Tur bulunamadı' },
        { status: 404 }
      );
    }

    // Kontenjan kontrolü
    if (tour.available < numberOfPeople) {
      return NextResponse.json(
        { error: 'Yeterli kontenjan bulunmamaktadır' },
        { status: 400 }
      );
    }

    // Rezervasyonu oluştur
    const reservation = await prisma.reservation.create({
      data: {
        tourId,
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        country,
        specialRequests,
        numberOfPeople,
        status: 'PENDING',
        totalPrice: tour.price * numberOfPeople,
      },
    });

    // Tur kontenjanını güncelle
    await prisma.tour.update({
      where: { id: tourId },
      data: {
        available: tour.available - numberOfPeople,
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Rezervasyon oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Rezervasyon oluşturulamadı' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('Fetching reservations for user:', session.user.email); // Debug log

    const reservations = await prisma.reservation.findMany({
      where: {
        email: session.user.email
      },
      orderBy: {
        createdAt: 'desc'
      },
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

    console.log('Found reservations:', reservations); // Debug log

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 