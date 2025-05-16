import { NextResponse } from 'next/server';
import { corsHeaders } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export default async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
} 