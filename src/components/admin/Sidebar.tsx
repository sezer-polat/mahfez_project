'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  if (!pathname || status === 'loading') {
    return <div className="w-64" />;
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/admin/giris');
  };

  const handleNavigation = (path: string) => {
    if (pathname !== path) {
      router.push(path);
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100';
    }
    return pathname.startsWith(path) ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100';
  };

  const isCurrent = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b">
          <button onClick={() => handleNavigation('/admin')} className="text-xl font-bold text-primary" aria-label="Dashboard">
            Mahfez Tur Admin
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => handleNavigation('/admin')}
            className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive('/admin')}`}
            aria-label="Dashboard"
            aria-current={isCurrent('/admin') ? 'page' : undefined}
          >
            <i className="ri-dashboard-line mr-3"></i>
            Dashboard
          </button>
          <button
            onClick={() => handleNavigation('/tours')}
            className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive('/tours')}`}
            aria-label="Turlar"
            aria-current={isCurrent('/tours') ? 'page' : undefined}
          >
            <i className="ri-map-pin-line mr-3"></i>
            Turlar
          </button>
          <button
            onClick={() => handleNavigation('/admin/categories')}
            className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive('/admin/categories')}`}
            aria-label="Kategoriler"
            aria-current={isCurrent('/admin/categories') ? 'page' : undefined}
          >
            <i className="ri-folder-line mr-3"></i>
            Kategoriler
          </button>
          <button
            onClick={() => handleNavigation('/admin/reservations')}
            className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive('/admin/reservations')}`}
            aria-label="Rezervasyonlar"
            aria-current={isCurrent('/admin/reservations') ? 'page' : undefined}
          >
            <i className="ri-calendar-check-line mr-3"></i>
            Rezervasyonlar
          </button>
          <button
            onClick={() => handleNavigation('/admin/users')}
            className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive('/admin/users')}`}
            aria-label="Kullanıcılar"
            aria-current={isCurrent('/admin/users') ? 'page' : undefined}
          >
            <i className="ri-user-line mr-3"></i>
            Kullanıcılar
          </button>
          <button
            onClick={() => handleNavigation('/admin/reports')}
            className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive('/admin/reports')}`}
            aria-label="Raporlar"
            aria-current={isCurrent('/admin/reports') ? 'page' : undefined}
          >
            <i className="ri-bar-chart-line mr-3"></i>
            Raporlar
          </button>
          <button
            onClick={() => handleNavigation('/admin/settings')}
            className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive('/admin/settings')}`}
            aria-label="Ayarlar"
            aria-current={isCurrent('/admin/settings') ? 'page' : undefined}
          >
            <i className="ri-settings-line mr-3"></i>
            Ayarlar
          </button>
          <button
            onClick={() => handleNavigation('/admin/messages')}
            className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive('/admin/messages')}`}
            aria-label="İletişim Mesajları"
            aria-current={isCurrent('/admin/messages') ? 'page' : undefined}
          >
            <i className="ri-mail-line mr-3"></i>
            İletişim Mesajları
          </button>
          <button
            onClick={() => handleNavigation('/admin/slider')}
            className={`flex items-center w-full px-4 py-2 rounded-lg ${isActive('/admin/slider')}`}
            aria-label="Slider Yönetimi"
            aria-current={isCurrent('/admin/slider') ? 'page' : undefined}
          >
            <i className="ri-slideshow-line mr-3"></i>
            Slider Yönetimi
          </button>
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
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            aria-label="Çıkış Yap"
          >
            <i className="ri-logout-box-line mr-3"></i>
            Çıkış Yap
          </button>
        </div>
      </div>
    </aside>
  );
} 