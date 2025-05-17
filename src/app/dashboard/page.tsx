'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  category: {
    name: string;
  };
  image: string;
}

interface Reservation {
  id: string;
  tour: {
    title: string;
    image: string;
    startDate: string;
    endDate: string;
  };
  numberOfPeople: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalPrice: number;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Öne çıkan turları getir
        const toursResponse = await fetch('/api/tours/featured');
        if (!toursResponse.ok) {
          throw new Error('Turlar yüklenirken bir hata oluştu');
        }
        const toursData = await toursResponse.json();
        setFeaturedTours(toursData);

        // Son rezervasyonları getir
        const reservationsResponse = await fetch('/api/reservations');
        if (!reservationsResponse.ok) {
          throw new Error('Rezervasyonlar yüklenirken bir hata oluştu');
        }
        const reservationsData = await reservationsResponse.json();
        setRecentReservations(reservationsData.slice(0, 3));
      } catch (error) {
        setError('Veriler yüklenirken bir hata oluştu');
        console.error('Dashboard veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hoşgeldiniz Kartı */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Hoş Geldiniz, {session?.user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Tur rezervasyonlarınızı yönetebilir ve profil bilgilerinizi güncelleyebilirsiniz.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Öne Çıkan Turlar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Öne Çıkan Turlar</h2>
          <Link
            href="/tours"
            className="text-primary hover:text-opacity-80 text-sm font-medium"
          >
            Tümünü Gör
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-sm">
                  {tour.category.name}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {tour.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {tour.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold">
                    {tour.price.toLocaleString('tr-TR')} ₺
                  </span>
                  <Link
                    href={`/tours/${tour.id}`}
                    className="text-primary hover:text-opacity-80 text-sm font-medium"
                  >
                    Detayları Gör
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Son Rezervasyonlar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Son Rezervasyonlar</h2>
          <Link
            href="/profilim"
            className="text-primary hover:text-opacity-80 text-sm font-medium"
          >
            Tümünü Gör
          </Link>
        </div>
        {recentReservations.length === 0 ? (
          <p className="text-gray-600 text-center py-4">
            Henüz rezervasyonunuz bulunmuyor.
          </p>
        ) : (
          <div className="space-y-4">
            {recentReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {reservation.tour.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {reservation.tour.startDate && reservation.tour.endDate ? `${new Date(reservation.tour.startDate).toLocaleDateString('tr-TR')} - ${new Date(reservation.tour.endDate).toLocaleDateString('tr-TR')}` : ''}
                    </p>
                    <p className="text-sm text-gray-600">
                      Katılımcı Sayısı: {reservation.numberOfPeople}
                    </p>
                    <p className="text-sm text-gray-600">
                      Toplam Tutar: {reservation.totalPrice.toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        reservation.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-800'
                          : reservation.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {reservation.status === 'CONFIRMED'
                        ? 'Onaylandı'
                        : reservation.status === 'CANCELLED'
                        ? 'İptal Edildi'
                        : 'Beklemede'}
                    </span>
                    <Link
                      href={`/tours/${reservation.tour.title}`}
                      className="text-primary hover:text-opacity-80 text-sm font-medium"
                    >
                      Tur Detayları
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 