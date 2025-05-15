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

export { handler as GET, handler as POST }; 