import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { corsHeaders } from "@/lib/cors";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
} 