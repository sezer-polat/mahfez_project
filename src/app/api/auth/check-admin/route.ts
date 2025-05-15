import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  console.log('Check admin request received:', {
    method: 'GET',
    path: '/api/auth/check-admin',
    timestamp: new Date().toISOString()
  });

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { isAdmin: false, error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    const isAdmin = session.user.role === "ADMIN";
    
    if (!isAdmin) {
      return NextResponse.json(
        { isAdmin: false, error: 'Forbidden' },
        { status: 403, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { isAdmin: true },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Check admin error:', error);
    return NextResponse.json(
      { 
        isAdmin: false,
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
} 