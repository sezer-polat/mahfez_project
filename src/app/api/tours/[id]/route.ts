import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Tek bir turu getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tour = await prisma.tour.findUnique({
      where: {
        id: params.id,
      },
      include: {
        category: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        itinerary: {
          orderBy: {
            day: 'asc',
          },
        },
      },
    });

    if (!tour) {
      return NextResponse.json(
        { error: 'Tur bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { error: 'Tur bilgileri yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// PUT: Tur güncelle
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  // @ts-ignore
  const tour = await prisma.tour.update({ where: { id: params.id }, data });
  return NextResponse.json(tour);
}

// DELETE: Tur sil
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 401 }
      );
    }

    await prisma.tour.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tur silme hatası:', error);
    return NextResponse.json(
      { error: 'Tur silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 