import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { bookingIds, action } = await req.json()

    if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
      return new NextResponse('Geçersiz rezervasyon ID\'leri', { status: 400 })
    }

    if (!['CONFIRM', 'CANCEL'].includes(action)) {
      return new NextResponse('Geçersiz işlem', { status: 400 })
    }

    const newStatus = action === 'CONFIRM' ? 'CONFIRMED' : 'CANCELLED'

    // Toplu güncelleme işlemini transaction içinde yap
    await prisma.$transaction(async (tx) => {
      // Önce tüm rezervasyonları ve turları getir
      const reservations = await tx.reservation.findMany({
        where: {
          id: {
            in: bookingIds
          }
        },
        include: {
          tour: true
        }
      });

      // Onaylama işlemi için kapasite kontrolü
      if (action === 'CONFIRM') {
        // Her tur için toplam katılımcı sayısını hesapla
        const tourParticipants = new Map<string, number>();
        reservations.forEach(reservation => {
          if (reservation.status !== 'CONFIRMED') {
            const current = tourParticipants.get(reservation.tourId) || 0;
            tourParticipants.set(reservation.tourId, current + reservation.numberOfPeople);
          }
        });

        // Her tur için kapasite kontrolü yap
        for (const [tourId, participants] of tourParticipants) {
          const tour = await tx.tour.findUnique({
            where: { id: tourId }
          });

          if (!tour) {
            throw new Error(`Tur bulunamadı: ${tourId}`);
          }

          if (tour.available < participants) {
            throw new Error(`Yetersiz kapasite: ${tour.title}`);
          }
        }

        // Kapasiteleri güncelle
        for (const [tourId, participants] of tourParticipants) {
          await tx.tour.update({
            where: { id: tourId },
            data: {
              available: {
                decrement: participants
              }
            }
          });
        }
      }
      // İptal işlemi için kapasiteleri geri ekle
      else if (action === 'CANCEL') {
        // Her tur için toplam katılımcı sayısını hesapla
        const tourParticipants = new Map<string, number>();
        reservations.forEach(reservation => {
          if (reservation.status === 'CONFIRMED') {
            const current = tourParticipants.get(reservation.tourId) || 0;
            tourParticipants.set(reservation.tourId, current + reservation.numberOfPeople);
          }
        });

        // Kapasiteleri güncelle
        for (const [tourId, participants] of tourParticipants) {
          await tx.tour.update({
            where: { id: tourId },
            data: {
              available: {
                increment: participants
              }
            }
          });
        }
      }

      // Rezervasyon durumlarını güncelle
      await tx.reservation.updateMany({
        where: {
          id: {
            in: bookingIds
          }
        },
        data: {
          status: newStatus
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: `${bookingIds.length} rezervasyon ${action === 'CONFIRM' ? 'onaylandı' : 'iptal edildi'}`
    })
  } catch (error) {
    console.error('Bulk reservation error:', error)
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    )
  }
} 