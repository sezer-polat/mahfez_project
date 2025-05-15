import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Tüm kategorileri getir
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
      const categories = await prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },
      });

      return NextResponse.json(categories);
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
    console.error('Get categories error:', error);
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

// Yeni kategori ekle
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log('Request data:', data);

    const { name, description } = data;

    if (!name) {
      return NextResponse.json(
        { message: 'Kategori adı zorunludur' },
        { status: 400 }
      );
    }

    try {
      // Aynı isimde kategori var mı kontrol et
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive'
          }
        }
      });

      if (existingCategory) {
        return NextResponse.json(
          { message: 'Bu isimde bir kategori zaten mevcut' },
          { status: 400 }
        );
      }

      const category = await prisma.category.create({
        data: {
          name,
          description: description || null,
          updatedAt: new Date()
        },
      });

      return NextResponse.json(category);
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
    console.error('Create category error:', error);
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