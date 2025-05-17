import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPath = request.nextUrl.pathname === '/admin/giris';

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

    // Diğer admin sayfalarına erişim kontrolü
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/giris', request.url));
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
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 