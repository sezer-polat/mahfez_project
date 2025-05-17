'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Mahfez Tur</h3>
            <p className="text-gray-400 mb-4">
              Unutulmaz seyahat deneyimleri için yanınızdayız.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a
                href="https://www.instagram.com/mahfezturizm/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <i className="ri-instagram-fill text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/turlar" className="text-gray-400 hover:text-white">
                  Turlar
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-gray-400 hover:text-white">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-400 hover:text-white">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">İletişim</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="ri-map-pin-line text-gray-400 mt-1 mr-2"></i>
                <span className="text-gray-400">Diyarbakır Kayapınar</span>
              </li>
              <li className="flex items-start">
                <i className="ri-phone-line text-gray-400 mt-1 mr-2"></i>
                <a href="tel:+905056245112" className="text-gray-400 hover:text-white">
                  +90 (505) 624 51 12
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">Çalışma Saatleri</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Pazartesi - Cuma: 09:00 - 18:00</li>
              <li>Cumartesi: 10:00 - 14:00</li>
              <li>Pazar: Kapalı</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Mahfez Tur. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
} 