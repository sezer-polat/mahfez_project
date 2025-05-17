import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  try {
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
      cookies: request.cookies.getAll().map(c => c.name),
      headers: Object.fromEntries(request.headers.entries())
    });

    // Admin sayfalarına erişim kontrolü
    if (request.nextUrl.pathname.startsWith('/admin')) {
      // Giriş sayfası kontrolü
      if (request.nextUrl.pathname === '/admin/giris') {
        // Eğer kullanıcı zaten giriş yapmış ve admin ise dashboard'a yönlendir
        if (token?.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.next();
      }

      // Ana admin sayfası kontrolü
      if (request.nextUrl.pathname === '/admin') {
        if (!token || token.role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/giris', request.url));
        }
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

      // Diğer admin sayfaları için kontrol
      if (!token) {
        console.log('No token found, redirecting to login');
        return NextResponse.redirect(new URL('/admin/giris', request.url));
      }

      if (token.role !== 'ADMIN') {
        console.log('User is not admin, redirecting to login');
        return NextResponse.redirect(new URL('/admin/giris', request.url));
      }

      // Token ve rol kontrolü başarılı
      console.log('Access granted to:', request.nextUrl.pathname);
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Error:', error);
    return NextResponse.redirect(new URL('/admin/giris', request.url));
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 