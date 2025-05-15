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

    if (!status || !['CANCELLED'].includes(status)) {
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

      // Rezervasyonun e-posta adresi ile oturum açan kullanıcının e-posta adresi eşleşmeli
      if (reservation.email !== session.user.email) {
        throw new Error('Bu rezervasyonu değiştirme yetkiniz yok');
      }

      // Sadece onaylanmış rezervasyonlar iptal edilebilir
      if (status === 'CANCELLED' && reservation.status === 'CONFIRMED') {
        // Tur kapasitesini artır
        await tx.tour.update({
          where: { id: reservation.tourId },
          data: {
            available: {
              increment: reservation.numberOfPeople
            }
          }
        });
      } else {
        throw new Error('Sadece onaylanmış rezervasyonlar iptal edilebilir');
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