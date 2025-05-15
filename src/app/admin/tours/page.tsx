'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Sidebar from '../Sidebar';
import Link from 'next/link';

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  image: string | null;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  capacity: number;
  available: number;
  startDate: Date;
  endDate: Date;
  category: {
    id: string;
    name: string;
  };
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState(10000);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const itemsPerPage = 9;
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceAction, setPriceAction] = useState<'INCREASE' | 'DECREASE' | 'SET'>('INCREASE');
  const [priceAmount, setPriceAmount] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await fetch('/api/admin/tours');
      if (!response.ok) throw new Error('Turlar yüklenemedi');
      const data = await response.json();
      console.log('API Response:', data);
      setTours(data);
    } catch (error) {
      console.error('Turlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu turu silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/tours/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Tur silinemedi');

      setTours(tours.filter(tour => tour.id !== id));
    } catch (error) {
      console.error('Tur silinirken hata:', error);
      alert('Tur silinirken bir hata oluştu');
    }
  };

  const handleBulkPriceUpdate = async () => {
    if (selectedTours.length === 0) {
      setError('Lütfen en az bir tur seçin');
      return;
    }

    const amount = parseFloat(priceAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Geçerli bir miktar girin');
      return;
    }

    setBulkActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/bulk-price', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourIds: selectedTours,
          action: priceAction,
          amount
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Bir hata oluştu');
      }

      setSuccess(data.message);
      setSelectedTours([]);
      setShowPriceModal(false);
      setPriceAmount('');
      
      // Turları yeniden yükle
      const toursRes = await fetch('/api/admin/tours');
      if (toursRes.ok) {
        const toursData = await toursRes.json();
        setTours(toursData);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tour.categoryId === selectedCategory;
    const matchesPrice = tour.price <= priceRange;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sayfalama için tur listesini böl
  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
  const paginatedTours = filteredTours.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 pl-[150px]">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Turlar</h1>
        <button
          onClick={() => router.push('/admin/tours/new')}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
        >
          <i className="ri-add-line mr-2"></i>
          Yeni Tur Ekle
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tur Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlangıç Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bitiş Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kapasite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tours.map((tour) => (
                <tr key={tour.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{tour.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tour.category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {tour.startDate ? format(new Date(tour.startDate), 'dd MMMM yyyy', { locale: tr }) : 'Tarih belirtilmemiş'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {tour.endDate ? format(new Date(tour.endDate), 'dd MMMM yyyy', { locale: tr }) : 'Tarih belirtilmemiş'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tour.price} TL</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tour.capacity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => router.push(`/admin/tours/${tour.id}`)}
                      className="text-primary hover:text-primary/80 mr-4"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(tour.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Sil
                    </button>
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