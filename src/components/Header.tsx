'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            Mahfez Tur
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium ${
                isActive('/') ? 'text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/tours"
              className={`text-sm font-medium ${
                isActive('/tours') ? 'text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              Turlar
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium ${
                isActive('/about') ? 'text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              Hakkımızda
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium ${
                isActive('/contact') ? 'text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              İletişim
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profilim"
                  className={`text-sm font-medium ${
                    isActive('/profilim') ? 'text-primary' : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  Profilim
                </Link>
              </div>
            ) : null}
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-gray-700 hover:text-primary"
                  >
                    Çıkış Yap
                  </button>
                  <Link
                    href="/admin"
                    className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors"
                  >
                    Panel
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/giris"
                    className="text-sm font-medium text-gray-700 hover:text-primary"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/kayit"
                    className="btn btn-primary text-sm"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`text-sm font-medium ${
                  isActive('/') ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                href="/tours"
                className={`text-sm font-medium ${
                  isActive('/tours') ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Turlar
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium ${
                  isActive('/about') ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Hakkımızda
              </Link>
              <Link
                href="/contact"
                className={`text-sm font-medium ${
                  isActive('/contact') ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                İletişim
              </Link>
              {session ? (
                <>
                  <Link
                    href="/profilim"
                    className={`text-sm font-medium ${
                      isActive('/profilim') ? 'text-primary' : 'text-gray-700 hover:text-primary'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profilim
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/giris"
                    className="text-sm font-medium text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/kayit"
                    className="btn btn-primary text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 