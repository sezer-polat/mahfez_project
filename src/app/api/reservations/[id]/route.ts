import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['CONFIRMED', 'CANCELLED'].includes(status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    // Rezervasyonu ve turu aynı anda güncelle
    const result = await prisma.$transaction(async (tx) => {
      // Önce rezervasyonu bul
      const reservation = await tx.reservation.findUnique({
        where: { id: params.id },
        include: { tour: true }
      });

      if (!reservation) {
        throw new Error('Rezervasyon bulunamadı');
      }

      // Sadece admin veya rezervasyon sahibi güncelleyebilir
      if (
        session.user.role !== 'ADMIN' &&
        reservation.email !== session.user.email
      ) {
        throw new Error('Bu rezervasyonu değiştirme yetkiniz yok');
      }

      // İptal işlemi: CONFIRMED'dan CANCELLED'a geçerken tur kapasitesini artır
      if (status === 'CANCELLED' && reservation.status === 'CONFIRMED') {
        await tx.tour.update({
          where: { id: reservation.tourId },
          data: {
            available: {
              increment: reservation.numberOfPeople
            }
          }
        });
      }

      // Rezervasyon durumunu güncelle
      return await tx.reservation.update({
        where: { id: params.id },
        data: { status }
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
} 