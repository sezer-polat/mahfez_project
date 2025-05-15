import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: Tek bir rezervasyonu getir
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      tour: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          // password hariç
        }
      }
    }
  });

  if (!booking) {
    return NextResponse.json(
      { error: 'Rezervasyon bulunamadı' },
      { status: 404 }
    );
  }

  return NextResponse.json(booking);
}

// PUT: Rezervasyon güncelle
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined
      },
      include: {
        tour: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            // password hariç
          }
        }
      }
    });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: 'Rezervasyon güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Rezervasyonu iptal et
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { tour: true }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Rezervasyon bulunamadı' }, { status: 404 });
    }

    // Sadece kendi rezervasyonunu iptal edebilir
    if (booking.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 });
    }

    // Transaction ile rezervasyon iptali ve kapasite güncelleme
    await prisma.$transaction(async (tx) => {
      // Rezervasyonu sil
      await tx.booking.delete({
        where: { id: params.id }
      });

      // Tur kapasitesini güncelle
      await tx.tour.update({
        where: { id: booking.tourId },
        data: {
          available: {
            increment: 1 // Her rezervasyon için 1 kişilik kapasite artır
          }
        }
      });
    });

    return NextResponse.json({ message: 'Rezervasyon başarıyla iptal edildi' });
  } catch (error) {
    console.error('Rezervasyon iptal hatası:', error);
    return NextResponse.json(
      { error: 'Rezervasyon iptal edilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 