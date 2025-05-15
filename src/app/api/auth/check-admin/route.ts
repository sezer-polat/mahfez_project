import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ isAdmin: false, error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.role === "ADMIN";
    
    if (!isAdmin) {
      return NextResponse.json({ isAdmin: false, error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ isAdmin: true });
  } catch (error) {
    console.error('Check admin error:', error);
    return NextResponse.json({ isAdmin: false, error: 'Internal Server Error' }, { status: 500 });
  }
} 