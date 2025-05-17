"use client";

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    tourCount: 0,
    bookingCount: 0,
    userCount: 0,
    messageCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        if (!res.ok) throw new Error('İstatistikler yüklenemedi');
        const data = await res.json();
        setStats(data);
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
          <h3 className="text-lg font-semibold text-gray-900">Aktif Rezervasyon</h3>
          <p className="text-3xl font-bold text-primary mt-2">{loading ? '-' : stats.bookingCount}</p>
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
          <div className="text-gray-500 text-center py-8">
            Henüz rezervasyon bulunmuyor
          </div>
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