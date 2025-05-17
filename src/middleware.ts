import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Admin sayfalarına erişim kontrolü
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Giriş sayfası hariç tüm admin sayfaları için kontrol
    if (request.nextUrl.pathname !== '/admin/giris') {
      // Token yoksa veya admin değilse giriş sayfasına yönlendir
      if (!token || token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/giris', request.url));
      }
    } else {
      // Giriş sayfasında ve admin ise dashboard'a yönlendir
      if (token?.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 