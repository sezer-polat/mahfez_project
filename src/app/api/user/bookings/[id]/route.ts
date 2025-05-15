import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Status } from '@prisma/client';

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
      // Rezervasyonu güncelle
      await tx.booking.update({
        where: { id: params.id },
        data: {
          status: Status.CANCELLED
        }
      });

      // Tur kapasitesini güncelle
      await tx.tour.update({
        where: { id: booking.tourId },
        data: {
          available: {
            increment: booking.numberOfPeople
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