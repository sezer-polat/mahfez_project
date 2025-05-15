import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function PUT(
  request: Request,
  { params }: { params: { id: string; dayId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { title, description, activities, meals, accommodation, order } = body;

    const itinerary = await prisma.itinerary.update({
      where: {
        id: params.dayId,
        tourId: params.id,
      },
      data: {
        title,
        description,
        activities,
        meals,
        accommodation,
        order: order ?? 0
      },
    });

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; dayId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.itinerary.delete({
      where: {
        id: params.dayId,
        tourId: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 