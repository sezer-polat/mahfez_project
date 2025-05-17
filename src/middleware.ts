import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production'
    });

    const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
    const isLoginPath = request.nextUrl.pathname === '/admin/giris';
    const isRootAdminPath = request.nextUrl.pathname === '/admin';
    const isDashboardPath = request.nextUrl.pathname === '/admin/dashboard';

    // Debug bilgisi
    console.log('Middleware Debug:', {
      path: request.nextUrl.pathname,
      token: token ? {
        role: token.role,
        email: token.email,
        name: token.name
      } : null,
      isAdminPath,
      isLoginPath,
      isRootAdminPath,
      isDashboardPath
    });

    // Admin sayfalarına erişim kontrolü
    if (isAdminPath) {
      // Giriş sayfasına erişim kontrolü
      if (isLoginPath) {
        // Eğer kullanıcı zaten giriş yapmış ve admin ise dashboard'a yönlendir
        if (token?.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.next();
      }

      // Ana admin sayfasına erişim kontrolü
      if (isRootAdminPath) {
        if (!token || token.role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/giris', request.url));
        }
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

      // Dashboard ve diğer admin sayfalarına erişim kontrolü
      if (isDashboardPath || !isLoginPath) {
        if (!token) {
          console.log('No token found, redirecting to login');
          return NextResponse.redirect(new URL('/admin/giris', request.url));
        }

        if (token.role !== 'ADMIN') {
          console.log('User is not admin, redirecting to login');
          return NextResponse.redirect(new URL('/admin/giris', request.url));
        }

        // Token ve rol kontrolü başarılı, sayfaya erişime izin ver
        return NextResponse.next();
      }
    }

    // API routes için OPTIONS isteklerini yönet
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
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