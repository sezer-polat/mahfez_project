import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Token'ı al
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production'
  });

  // Debug bilgisi
  console.log('Middleware Debug:', {
    path: request.nextUrl.pathname,
    token: token ? {
      role: token.role,
      email: token.email,
      name: token.name
    } : null,
    cookies: request.cookies.getAll()
  });

  // Admin sayfalarına erişim kontrolü
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Giriş sayfası hariç tüm admin sayfaları için kontrol
    if (request.nextUrl.pathname !== '/admin/giris') {
      // Token yoksa veya admin değilse giriş sayfasına yönlendir
      if (!token) {
        console.log('No token found');
        return NextResponse.redirect(new URL('/admin/giris', request.url));
      }

      if (token.role !== 'ADMIN') {
        console.log('User is not admin');
        return NextResponse.redirect(new URL('/admin/giris', request.url));
      }

      // Token ve rol kontrolü başarılı
      console.log('Access granted');
      return NextResponse.next();
    } else {
      // Giriş sayfasında ve admin ise dashboard'a yönlendir
      if (token?.role === 'ADMIN') {
        console.log('Admin already logged in, redirecting to dashboard');
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