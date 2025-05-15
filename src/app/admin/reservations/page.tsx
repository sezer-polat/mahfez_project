'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Reservation {
  id: string;
  tour: {
    title: string;
  };
  firstName: string;
  lastName: string;
  email: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  numberOfPeople: number;
  totalPrice: number;
  createdAt: string;
}

export default function ReservationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservations, setSelectedReservations] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/reservations');
        if (response.ok) {
          const data = await response.json();
          setReservations(data);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
        toast.error('Rezervasyonlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'ADMIN') {
      fetchReservations();
    }
  }, [session]);

  const handleStatusChange = async (id: string, newStatus: 'CONFIRMED' | 'CANCELLED') => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setReservations(reservations.map(reservation =>
          reservation.id === id ? { ...reservation, status: newStatus } : reservation
        ));
        toast.success('Rezervasyon durumu güncellendi');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Error updating reservation status:', error);
      toast.error('Bir hata oluştu');
    }
  };

  const handleBulkAction = async (action: 'CONFIRM' | 'CANCEL') => {
    if (selectedReservations.length === 0) {
      toast.error('Lütfen en az bir rezervasyon seçin');
      return;
    }

    setBulkActionLoading(true);

    try {
      const response = await fetch('/api/admin/bulk-reservations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationIds: selectedReservations,
          action
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Bir hata oluştu');
      }

      toast.success(data.message);
      setSelectedReservations([]);
      
      setReservations(reservations.map(reservation =>
        selectedReservations.includes(reservation.id)
          ? { ...reservation, status: action === 'CONFIRM' ? 'CONFIRMED' : 'CANCELLED' }
          : reservation
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
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Rezervasyonlar</h1>
      </div>

      {selectedReservations.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {selectedReservations.length} rezervasyon seçildi
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

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <div className="min-w-[1200px]">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={selectedReservations.length === reservations.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReservations(reservations.map(reservation => reservation.id));
                      } else {
                        setSelectedReservations([]);
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
                  Kişi Sayısı
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
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={selectedReservations.includes(reservation.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReservations([...selectedReservations, reservation.id]);
                        } else {
                          setSelectedReservations(selectedReservations.filter(id => id !== reservation.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{reservation.tour.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.firstName} {reservation.lastName}</div>
                    <div className="text-sm text-gray-500">{reservation.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                      {getStatusText(reservation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.numberOfPeople} kişi
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₺{reservation.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reservation.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="space-x-2">
                      {reservation.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'CONFIRMED')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'CANCELLED')}
                            className="text-red-600 hover:text-red-900"
                          >
                            İptal Et
                          </button>
                        </>
                      )}
                      {reservation.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleStatusChange(reservation.id, 'CANCELLED')}
                          className="text-red-600 hover:text-red-900"
                        >
                          İptal Et
                        </button>
                      )}
                      {reservation.status === 'CANCELLED' && (
                        <button
                          onClick={() => handleStatusChange(reservation.id, 'CONFIRMED')}
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
    </>
  );
} 