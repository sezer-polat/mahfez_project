import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const tour = await prisma.tour.findUnique({
      where: {
        id: params.id,
      },
      include: {
        category: true,
        itinerary: {
          orderBy: {
            day: 'asc',
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!tour) {
      return new NextResponse('Tour not found', { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      price,
      duration,
      categoryId,
      image,
      capacity,
      available,
      startDate,
      endDate,
      isActive,
    } = body;

    const tour = await prisma.tour.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        price,
        duration,
        categoryId,
        image,
        capacity,
        available,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive,
      },
      include: {
        category: true,
        itinerary: {
          orderBy: {
            day: 'asc',
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error updating tour:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.tour.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 