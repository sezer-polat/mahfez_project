"use client";

import { useEffect, useState } from 'react';

// Add type for reservation
interface Reservation {
  id: string;
  firstName: string;
  lastName: string;
  numberOfPeople: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  tour?: {
    title: string;
    image?: string;
    startDate?: string;
    endDate?: string;
  };
}

interface Stats {
  tourCount: number;
  userCount: number;
  messageCount: number;
  recentReservations: Reservation[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    tourCount: 0,
    userCount: 0,
    messageCount: 0,
    recentReservations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('İstatistikler yüklenemedi');
        const data = await res.json();
        setStats(prev => ({ ...prev, ...data }));
      } catch (err) {
        setError('İstatistikler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Toplam Tur</h3>
          <p className="text-3xl font-bold text-primary mt-2">{loading ? '-' : stats.tourCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Toplam Kullanıcı</h3>
          <p className="text-3xl font-bold text-primary mt-2">{loading ? '-' : stats.userCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Bekleyen Mesaj</h3>
          <p className="text-3xl font-bold text-primary mt-2">{loading ? '-' : stats.messageCount}</p>
        </div>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Rezervasyonlar</h3>
          {loading ? (
            <div className="text-gray-500 text-center py-8">Yükleniyor...</div>
          ) : stats.recentReservations && stats.recentReservations.length > 0 ? (
            <div className="space-y-4">
              {stats.recentReservations.map((reservation) => (
                <div key={reservation.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">{reservation.tour?.title}</div>
                    <div className="text-sm text-gray-600">{reservation.firstName} {reservation.lastName}</div>
                    <div className="text-sm text-gray-600">Katılımcı: {reservation.numberOfPeople}</div>
                    <div className="text-sm text-gray-600">Tutar: ${reservation.totalPrice?.toLocaleString('en-US')} $</div>
                    <div className="text-sm text-gray-600">Tarih: {new Date(reservation.createdAt).toLocaleDateString('tr-TR')}</div>
                  </div>
                  <span className={`mt-2 md:mt-0 px-2 py-1 rounded-full text-xs ${
                    reservation.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-800'
                      : reservation.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reservation.status === 'CONFIRMED'
                      ? 'Onaylandı'
                      : reservation.status === 'CANCELLED'
                      ? 'İptal Edildi'
                      : 'Beklemede'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">Henüz rezervasyon bulunmuyor</div>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Mesajlar</h3>
          <div className="text-gray-500 text-center py-8">
            Henüz mesaj bulunmuyor
          </div>
        </div>
      </div>
    </div>
  );
} 