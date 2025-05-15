import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

// Dosya yükleme limitleri
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// GET /api/admin/tours/[id]/images - Tur fotoğraflarını getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const images = await prisma.tourImage.findMany({
      where: {
        tourId: params.id,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/admin/tours/[id]/images - Yeni fotoğraf ekle
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
    const { url, title } = body;

    // Mevcut resimlerin sayısını al
    const existingImages = await prisma.tourImage.count({
      where: {
        tourId: params.id,
      },
    });

    const image = await prisma.tourImage.create({
      data: {
        tourId: params.id,
        url,
        title,
        order: existingImages + 1,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error creating image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT /api/admin/tours/[id]/images/[imageId] - Fotoğraf güncelle
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

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json(
        { message: 'Fotoğraf ID\'si gerekli' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const { title, order } = data;

    const image = await prisma.tourImage.update({
      where: {
        id: imageId
      },
      data: {
        title: title || null,
        order: order || 0
      }
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error updating tour image:', error);
    return NextResponse.json(
      { message: 'Fotoğraf güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tours/[id]/images/[imageId] - Fotoğraf sil
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
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json(
        { message: 'Fotoğraf ID\'si gerekli' },
        { status: 400 }
      );
    }

    // Önce fotoğrafı veritabanından sil
    const image = await prisma.tourImage.delete({
      where: {
        id: imageId
      }
    });

    // Dosyayı fiziksel olarak sil
    const filePath = join(process.cwd(), 'public', image.url);
    await unlink(filePath).catch(console.error);

    return NextResponse.json({ message: 'Fotoğraf başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting tour image:', error);
    return NextResponse.json(
      { message: 'Fotoğraf silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 