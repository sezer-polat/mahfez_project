import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const settings = await prisma.settings.findFirst();

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await prisma.settings.create({
        data: {
          siteName: 'Tur Rezervasyon Sistemi',
          siteDescription: 'Güvenilir ve kolay tur rezervasyon sistemi',
          contactEmail: 'info@example.com',
          contactPhone: '+90 555 555 5555',
          address: 'İstanbul, Türkiye',
          socialMedia: {
            facebook: '',
            twitter: '',
            instagram: 'https://www.instagram.com/mahfezturizm/',
          },
        },
      });
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const {
      siteName,
      siteDescription,
      contactEmail,
      contactPhone,
      address,
      socialMedia,
    } = body;

    const settings = await prisma.settings.upsert({
      where: {
        id: '1', // Assuming we only have one settings record
      },
      update: {
        siteName,
        siteDescription,
        contactEmail,
        contactPhone,
        address,
        socialMedia,
      },
      create: {
        id: '1',
        siteName,
        siteDescription,
        contactEmail,
        contactPhone,
        address,
        socialMedia,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 