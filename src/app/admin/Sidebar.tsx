'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    setIsLoading(false);
  }, [status]);

  const isActive = (path: string) => {
    return pathname === path ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100';
  };
  // Giriş sayfasında veya yüklenirken sidebar gösterme
  if (pathname === '/admin/giris' || isLoading || session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b">
          <Link href="/admin" className="text-xl font-bold text-primary">
            Mahfez Tur Admin
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className={`flex items-center px-4 py-2 rounded-lg ${isActive('/admin')}`}
          >
            <i className="ri-dashboard-line mr-3"></i>
            Dashboard
          </Link>
          <Link
            href="/admin/tours"
            className={`flex items-center px-4 py-2 rounded-lg ${isActive('/admin/tours')}`}
          >
            <i className="ri-map-pin-line mr-3"></i>
            Tours
          </Link>
          <Link
            href="/admin/categories"
            className={`flex items-center px-4 py-2 rounded-lg ${isActive('/admin/categories')}`}
          >
            <i className="ri-folder-line mr-3"></i>
            Kategoriler
          </Link>
          <Link
            href="/admin/bookings"
            className={`flex items-center px-4 py-2 rounded-lg ${isActive('/admin/bookings')}`}
          >
            <i className="ri-calendar-check-line mr-3"></i>
            Rezervasyonlar
          </Link>
          <Link
            href="/admin/users"
            className={`flex items-center px-4 py-2 rounded-lg ${isActive('/admin/users')}`}
          >
            <i className="ri-user-line mr-3"></i>
            Kullanıcılar
          </Link>
          <Link
            href="/admin/reports"
            className={`flex items-center px-4 py-2 rounded-lg ${isActive('/admin/reports')}`}
          >
            <i className="ri-bar-chart-line mr-3"></i>
            Raporlar
          </Link>
          <Link
            href="/admin/settings"
            className={`flex items-center px-4 py-2 rounded-lg ${isActive('/admin/settings')}`}
          >
            <i className="ri-settings-line mr-3"></i>
            Ayarlar
          </Link>
          <Link
            href="/admin/messages"
            className={`flex items-center px-4 py-2 rounded-lg ${isActive('/admin/messages')}`}
          >
            <i className="ri-mail-line mr-3"></i>
            İletişim Mesajları
          </Link>
          <Link
            href="/admin/slider"
            className={`flex items-center px-4 py-2 rounded-lg ${isActive('/admin/slider')}`}
          >
            <i className="ri-slideshow-line mr-3"></i>
            Slider Yönetimi
          </Link>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
              {session?.user?.name?.[0] || session?.user?.email?.[0]}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/api/auth/signout')}
            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <i className="ri-logout-box-line mr-3"></i>
            Çıkış Yap
          </button>
        </div>
      </div>
    </aside>
  );
} 
