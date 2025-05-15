'use client';

import { useState } from 'react';

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: string;
  duration: string;
  type: 'domestic' | 'international' | 'daily';
}

export function TourManagement() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const handleAddTour = () => {
    // TODO: Yeni tur ekleme formunu göster
  };

  const handleEditTour = (tour: Tour) => {
    setSelectedTour(tour);
    // TODO: Tur düzenleme formunu göster
  };

  const handleDeleteTour = async (tourId: string) => {
    if (confirm('Bu turu silmek istediğinizden emin misiniz?')) {
      try {
        const res = await fetch(`/api/tours/${tourId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setTours(tours.filter((tour) => tour.id !== tourId));
        } else {
          alert('Tur silinirken bir hata oluştu.');
        }
      } catch (error) {
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Tur Yönetimi</h1>
        <button
          onClick={handleAddTour}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
        >
          Yeni Tur Ekle
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tur Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fiyat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tip
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
                  <div className="text-sm text-gray-500">{tour.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{tour.price} TL</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{tour.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditTour(tour)}
                    className="text-primary hover:text-primary-dark mr-4"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDeleteTour(tour.id)}
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
  );
} 