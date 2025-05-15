'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">Tur Rezervasyon</h2>
      </div>

      <nav className="mt-6">
        <div className="px-4 py-2">
          <div className="text-sm font-medium text-gray-500">Ana Menü</div>
        </div>

        <Link
          href="/"
          className={`flex items-center px-6 py-3 text-sm ${
            isActive('/') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <i className="ri-home-line mr-3 text-lg"></i>
          Ana Sayfa
        </Link>

        <Link
          href="/tours"
          className={`flex items-center px-6 py-3 text-sm ${
            isActive('/tours') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <i className="ri-map-pin-line mr-3 text-lg"></i>
          Turlar
        </Link>

        {session?.user && (
          <>
            <div className="px-4 py-2 mt-4">
              <div className="text-sm font-medium text-gray-500">Hesabım</div>
            </div>

            <Link
              href="/profile"
              className={`flex items-center px-6 py-3 text-sm ${
                isActive('/profile') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="ri-user-line mr-3 text-lg"></i>
              Profil Bilgileri
            </Link>

            <Link
              href="/bookings"
              className={`flex items-center px-6 py-3 text-sm ${
                isActive('/bookings') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="ri-calendar-check-line mr-3 text-lg"></i>
              Rezervasyonlarım
            </Link>

            <Link
              href="/favorites"
              className={`flex items-center px-6 py-3 text-sm ${
                isActive('/favorites') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="ri-heart-line mr-3 text-lg"></i>
              Favorilerim
            </Link>
          </>
        )}

        <div className="px-4 py-2 mt-4">
          <div className="text-sm font-medium text-gray-500">Diğer</div>
        </div>

        <Link
          href="/about"
          className={`flex items-center px-6 py-3 text-sm ${
            isActive('/about') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <i className="ri-information-line mr-3 text-lg"></i>
          Hakkımızda
        </Link>

        <Link
          href="/contact"
          className={`flex items-center px-6 py-3 text-sm ${
            isActive('/contact') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <i className="ri-customer-service-2-line mr-3 text-lg"></i>
          İletişim
        </Link>
      </nav>
    </div>
  );
} 