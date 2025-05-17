import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [tourCount, reservationCount, userCount, messageCount] = await Promise.all([
      prisma.tour.count(),
      prisma.reservation.count(),
      prisma.user.count(),
      prisma.contactMessage.count(),
    ]);
    return NextResponse.json({
      tourCount,
      reservationCount,
      userCount,
      messageCount,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Dashboard stats error', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 