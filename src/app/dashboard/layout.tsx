'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white shadow-lg">
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-600">{session?.user?.email}</p>
          </div>
          <nav className="mt-4">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <i className="ri-home-line mr-2"></i>
              Ana Sayfa
            </Link>
            <Link
              href="/dashboard/rezervasyonlarim"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <i className="ri-calendar-line mr-2"></i>
              Rezervasyonlarım
            </Link>
            <Link
              href="/dashboard/profilim"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <i className="ri-user-line mr-2"></i>
              Profilim
            </Link>
            <Link
              href="/turlar"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <i className="ri-map-pin-line mr-2"></i>
              Turları Görüntüle
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
} 