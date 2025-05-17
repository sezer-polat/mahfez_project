import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tüm turları getir
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    try {
      const tours = await prisma.tour.findMany({
        include: {
          category: true,
          images: true
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json(tours);
    } catch (error: any) {
      console.error('Database error:', error);
      return NextResponse.json(
        { 
          message: 'Veritabanı hatası',
          error: error.message,
          code: error.code,
          meta: error.meta
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Get tours error:', error);
    return NextResponse.json(
      { 
        message: 'Bir hata oluştu',
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}

// Yeni tur ekle
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const duration = formData.get('duration') as string;
    const categoryId = formData.get('categoryId') as string;
    const capacity = formData.get('capacity') as string;
    const image = formData.get('image') as File;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    if (!title || !description || !price || !duration || !categoryId || !startDate || !endDate) {
      return NextResponse.json(
        { message: 'Tüm alanları doldurun' },
        { status: 400 }
      );
    }

    let imageUrl = null;
    if (image) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Cloudinary'ye yükle
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'mahfez_tours', resource_type: 'image' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });
        // @ts-ignore
        imageUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json(
          { message: 'Resim yüklenirken bir hata oluştu' },
          { status: 500 }
        );
      }
    }

    try {
      const tour = await prisma.tour.create({
        data: {
          title,
          description,
          price: parseFloat(price),
          duration: parseInt(duration),
          categoryId,
          capacity: parseInt(capacity || '20'),
          available: parseInt(capacity || '20'),
          image: imageUrl || '',
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          isActive: true
        },
      });

      return NextResponse.json(tour);
    } catch (error: any) {
      console.error('Database error:', error);
      return NextResponse.json(
        { 
          message: 'Veritabanı hatası',
          error: error.message,
          code: error.code,
          meta: error.meta,
          stack: error.stack
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Tour create error:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu', error: error.message },
      { status: 500 }
    );
  }
} 