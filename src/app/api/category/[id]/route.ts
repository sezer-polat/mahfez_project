import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// Tekil kategori getir
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
  }
  return NextResponse.json(category);
}

// Kategori güncelle
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const data = await req.json();
  const updated = await prisma.category.update({
    where: { id },
    data,
  });
  return NextResponse.json(updated);
}

// Kategori sil
export async function DELETE(
  req: NextRequest,
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

    const id = params.id;

    // Transaction ile tüm ilişkili verileri sil
    await prisma.$transaction(async (tx) => {
      // Önce bu kategoriye ait turları bul
      const tours = await tx.tour.findMany({
        where: {
          categoryId: id
        },
        include: {
          bookings: true,
          itinerary: true,
          images: true,
          reservations: true,
          favorites: true
        }
      });

      // Her tur için ilişkili verileri sil
      for (const tour of tours) {
        // Rezervasyonları sil
        await tx.booking.deleteMany({
          where: {
            tourId: tour.id
          }
        });

        // Günlük programı sil
        await tx.itinerary.deleteMany({
          where: {
            tourId: tour.id
          }
        });

        // Fotoğrafları sil
        await tx.tourImage.deleteMany({
          where: {
            tourId: tour.id
          }
        });

        // Rezervasyonları sil
        await tx.reservation.deleteMany({
          where: {
            tourId: tour.id
          }
        });

        // Favorileri sil
        await tx.favorite.deleteMany({
          where: {
            tourId: tour.id
          }
        });
      }

      // Turları sil
      await tx.tour.deleteMany({
        where: {
          categoryId: id
        }
      });

      // En son kategoriyi sil
      await tx.category.delete({
        where: {
          id
        }
      });
    });

    return NextResponse.json({ message: 'Kategori ve ilişkili tüm veriler başarıyla silindi' });
  } catch (error) {
    console.error('Kategori silme hatası:', error);
    return NextResponse.json(
      { error: 'Kategori silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 