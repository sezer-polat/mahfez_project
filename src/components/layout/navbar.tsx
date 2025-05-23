'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const isAdmin = status === 'authenticated' && session?.user?.role === 'ADMIN';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background shadow border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-pacifico text-primary">
            Mahfez Tur
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/tours"
              className={`text-sm font-medium transition-colors ${
                isActive('/tours') ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Turlar
            </Link>
            <Link
              href="/hakkimizda"
              className={`text-sm font-medium transition-colors ${
                isActive('/hakkimizda') ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Hakkımızda
            </Link>
            <Link
              href="/iletisim"
              className={`text-sm font-medium transition-colors ${
                isActive('/iletisim') ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              İletişim
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {status === 'authenticated' && (
              <Link
                href="/profilim"
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                <i className="ri-user-line mr-1"></i>
                Profilim
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors"
              >
                Panel
              </Link>
            )}
            {status === 'authenticated' ? (
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                Çıkış Yap
              </button>
            ) : (
              <>
                <Link
                  href="/kayit"
                  className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  Kayıt Ol
                </Link>
                <Link
                  href="/giris"
                  className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  Giriş Yap
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Mobil menüyü aç/kapat"
          >
            <i className={mobileMenuOpen ? "ri-close-line ri-xl" : "ri-menu-line ri-xl"}></i>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col p-8 md:hidden animate-fade-in">
          <button
            className="self-end mb-8 text-gray-600 hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Menüyü kapat"
          >
            <i className="ri-close-line ri-2x"></i>
          </button>
          <nav className="flex flex-col gap-6 text-lg">
            <Link href="/" className={`font-medium ${isActive('/') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`} onClick={() => setMobileMenuOpen(false)}>
              Ana Sayfa
            </Link>
            <Link href="/tours" className={`font-medium ${isActive('/tours') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`} onClick={() => setMobileMenuOpen(false)}>
              Turlar
            </Link>
            <Link href="/hakkimizda" className={`font-medium ${isActive('/hakkimizda') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`} onClick={() => setMobileMenuOpen(false)}>
              Hakkımızda
            </Link>
            <Link href="/iletisim" className={`font-medium ${isActive('/iletisim') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`} onClick={() => setMobileMenuOpen(false)}>
              İletişim
            </Link>
            {status === 'authenticated' && (
              <Link href="/profilim" className="font-medium text-gray-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                <i className="ri-user-line mr-1"></i> Profilim
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Panel
              </Link>
            )}
            {status === 'authenticated' ? (
              <button
                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                className="font-medium text-gray-700 hover:text-primary text-left"
              >
                Çıkış Yap
              </button>
            ) : (
              <>
                <Link href="/kayit" className="font-medium text-gray-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                  Kayıt Ol
                </Link>
                <Link href="/giris" className="font-medium text-gray-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                  Giriş Yap
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </nav>
  );
} 