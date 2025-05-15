import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/tours/[id]/itinerary - Tur programını getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const itinerary = await prisma.itinerary.findMany({
      where: {
        tourId: params.id,
      },
      orderBy: {
        day: 'asc',
      },
    });

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/admin/tours/[id]/itinerary - Yeni gün ekle
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { day, title, description, activities, meals, accommodation } = body;

    // Önce mevcut günleri kontrol et
    const existingDays = await prisma.itinerary.findMany({
      where: {
        tourId: params.id,
      },
      orderBy: {
        day: 'desc',
      },
      take: 1,
    });

    // Yeni gün numarasını belirle
    const newDay = existingDays.length > 0 ? existingDays[0].day + 1 : 1;

    const itinerary = await prisma.itinerary.create({
      data: {
        tourId: params.id,
        day: newDay,
        title: title || `${newDay}. Gün`,
        description: description || '',
        activities: activities || [],
        meals: meals || [],
        accommodation: accommodation || '',
      },
    });

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT /api/admin/tours/[id]/itinerary/[dayId] - Gün güncelle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    // Güncelleme yapılacak günün kendisi hariç başka bir günle çakışıyor mu kontrol et
    const existingDay = await prisma.itinerary.findFirst({
      where: {
        tourId: params.id,
        day: updateData.day,
        id: {
          not: id
        }
      }
    });

    if (existingDay) {
      return NextResponse.json(
        { message: 'Bu gün için zaten başka bir program mevcut' },
        { status: 400 }
      );
    }

    const itinerary = await prisma.itinerary.update({
      where: {
        id
      },
      data: updateData
    });

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tours/[id]/itinerary/[dayId] - Gün sil
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const dayId = searchParams.get('dayId');

    if (!dayId) {
      return NextResponse.json(
        { message: 'Gün ID\'si gerekli' },
        { status: 400 }
      );
    }

    await prisma.itinerary.delete({
      where: {
        id: dayId
      }
    });

    return NextResponse.json({ message: 'Program günü başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 