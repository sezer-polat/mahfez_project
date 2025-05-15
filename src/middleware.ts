import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/giris";

  // Admin sayfaları için kontrol
  if (isAdminPage) {
    // Giriş sayfasındaysa ve token varsa admin paneline yönlendir
    if (isLoginPage && token?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Giriş sayfası değilse ve token yoksa veya admin değilse giriş sayfasına yönlendir
    if (!isLoginPage && (!token || token.role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/admin/giris", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
}; 