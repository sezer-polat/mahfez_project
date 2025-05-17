'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Tour {
  id: string;
  name: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  category: {
    name: string;
  };
}

interface Booking {
  id: string;
  tour: Tour;
  participants: number;
  createdAt: string;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
}

export default function MyBookings() {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'cancelled' | 'completed'>('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (!response.ok) {
          throw new Error('Rezervasyonlar yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        setError('Rezervasyonlar yüklenirken bir hata oluştu');
        console.error('Rezervasyonlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Bu rezervasyonu iptal etmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Rezervasyon iptal edilirken bir hata oluştu');
      }

      // Rezervasyonu listeden kaldır
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      setError('Rezervasyon iptal edilirken bir hata oluştu');
      console.error('Rezervasyon iptal hatası:', error);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter.toUpperCase();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-800">Rezervasyonlarım</h1>
        <p className="text-gray-600 mt-2">Tüm rezervasyonlarınızı buradan yönetebilirsiniz.</p>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-full ${
              filter === 'active'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-full ${
              filter === 'completed'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tamamlanan
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-full ${
              filter === 'cancelled'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            İptal Edilen
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">Henüz rezervasyonunuz bulunmuyor.</p>
          <Link
            href="/tours"
            className="inline-block mt-4 text-primary hover:text-opacity-80"
          >
            Turları Görüntüle
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-800">
                    {booking.tour.name}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      Tarih:{' '}
                      {new Date(booking.tour.startDate).toLocaleDateString('tr-TR')} -{' '}
                      {new Date(booking.tour.endDate).toLocaleDateString('tr-TR')}
                    </p>
                    <p>Kategori: {booking.tour.category.name}</p>
                    <p>Katılımcı Sayısı: {booking.participants}</p>
                    <p>
                      Toplam Tutar:{' '}
                      {(booking.tour.price * booking.participants).toLocaleString('tr-TR')} ₺
                    </p>
                    <p>
                      Durum:{' '}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          booking.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.status === 'ACTIVE'
                          ? 'Aktif'
                          : booking.status === 'CANCELLED'
                          ? 'İptal Edildi'
                          : 'Tamamlandı'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 space-x-2">
                  <Link
                    href={`/tours/${booking.tour.id}`}
                    className="inline-block px-4 py-2 text-sm text-primary hover:text-opacity-80"
                  >
                    Tur Detayları
                  </Link>
                  {booking.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="inline-block px-4 py-2 text-sm text-red-600 hover:text-red-800"
                    >
                      İptal Et
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 