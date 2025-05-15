import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const handler = NextAuth(authOptions);

// CORS için OPTIONS handler'ı
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// GET ve POST handler'ları
export const GET = async (req: Request) => {
  const response = await handler(req);
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    headers
  });
};

export const POST = async (req: Request) => {
  const response = await handler(req);
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    headers
  });
}; 