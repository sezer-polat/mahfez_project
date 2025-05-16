import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const reservations = await prisma.reservation.findMany({
      orderBy: {
        createdAt: 'desc',
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

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 