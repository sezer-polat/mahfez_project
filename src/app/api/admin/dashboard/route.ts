import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [tourCount, bookingCount, userCount, messageCount] = await Promise.all([
      prisma.tour.count(),
      prisma.booking.count(),
      prisma.user.count(),
      prisma.contactMessage.count(),
    ]);
    return NextResponse.json({
      tourCount,
      bookingCount,
      userCount,
      messageCount,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Dashboard stats error', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 