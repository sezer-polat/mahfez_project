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

    if (!session || session.user.role !== 'ADMIN') {
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

      // Eğer rezervasyon onaylanıyorsa ve daha önce onaylanmamışsa
      if (status === 'CONFIRMED' && reservation.status !== 'CONFIRMED') {
        // Tur kapasitesini kontrol et
        if (reservation.tour.available < reservation.numberOfPeople) {
          throw new Error('Yetersiz kapasite');
        }

        // Tur kapasitesini azalt
        await tx.tour.update({
          where: { id: reservation.tourId },
          data: {
            available: {
              decrement: reservation.numberOfPeople
            }
          }
        });
      }
      // Eğer rezervasyon iptal ediliyorsa ve daha önce onaylanmışsa
      else if (status === 'CANCELLED' && reservation.status === 'CONFIRMED') {
        // Tur kapasitesini artır
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
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    );
  }
} 