'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Sidebar from '../Sidebar';

interface Booking {
  id: string;
  tour: {
    title: string;
  };
  firstName: string;
  lastName: string;
  email: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalPrice: number;
  participants: number;
  createdAt: string;
}

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/giris');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/admin/bookings');
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Rezervasyonlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'ADMIN') {
      fetchBookings();
    }
  }, [session]);

  const handleStatusChange = async (id: string, newStatus: 'CONFIRMED' | 'CANCELLED') => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setBookings(bookings.map(booking =>
          booking.id === id ? { ...booking, status: newStatus } : booking
        ));
        toast.success('Rezervasyon durumu güncellendi');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Bir hata oluştu');
    }
  };

  const handleBulkAction = async (action: 'CONFIRM' | 'CANCEL') => {
    if (selectedBookings.length === 0) {
      toast.error('Lütfen en az bir rezervasyon seçin');
      return;
    }

    setBulkActionLoading(true);

    try {
      const response = await fetch('/api/admin/bulk-bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingIds: selectedBookings,
          action
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Bir hata oluştu');
      }

      toast.success(data.message);
      setSelectedBookings([]);
      
      // Rezervasyonları güncelle
      setBookings(bookings.map(booking =>
        selectedBookings.includes(booking.id)
          ? { ...booking, status: action === 'CONFIRM' ? 'CONFIRMED' : 'CANCELLED' }
          : booking
      ));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Onaylandı';
      case 'CANCELLED':
        return 'İptal Edildi';
      default:
        return 'Beklemede';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-8 ml-64">
        <h1 className="text-2xl font-bold mb-8 ml-[-150px]">Rezervasyonlar</h1>

        {selectedBookings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedBookings.length} rezervasyon seçildi
              </p>
              <div className="space-x-2">
                <button
                  onClick={() => handleBulkAction('CONFIRM')}
                  disabled={bulkActionLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {bulkActionLoading ? 'İşleniyor...' : 'Seçilenleri Onayla'}
                </button>
                <button
                  onClick={() => handleBulkAction('CANCEL')}
                  disabled={bulkActionLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  {bulkActionLoading ? 'İşleniyor...' : 'Seçilenleri İptal Et'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className="bg-white rounded-lg shadow-md overflow-hidden w-full ml-[-150px]"
          style={{ width: 'calc(100% + 470px)' }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={selectedBookings.length === bookings.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBookings(bookings.map(booking => booking.id));
                      } else {
                        setSelectedBookings([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Katılımcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBookings([...selectedBookings, booking.id]);
                        } else {
                          setSelectedBookings(selectedBookings.filter(id => id !== booking.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.tour.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.firstName} {booking.lastName}</div>
                    <div className="text-sm text-gray-500">{booking.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.participants} kişi
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₺{booking.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="space-x-2">
                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                            className="text-red-600 hover:text-red-900"
                          >
                            İptal Et
                          </button>
                        </>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                          className="text-red-600 hover:text-red-900"
                        >
                          İptal Et
                        </button>
                      )}
                      {booking.status === 'CANCELLED' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Onayla
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 