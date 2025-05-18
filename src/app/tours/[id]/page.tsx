'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  startDate: string;
  endDate: string;
  image: string;
  capacity: number;
  available: number;
  category: {
    name: string;
  };
  images: {
    id: string;
    url: string;
    title: string;
  }[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation: string;
  }[];
}

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`/api/tours/${params.id}`);
        if (!response.ok) {
          throw new Error('Tur bilgileri yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setTour(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Tur bulunamadı'}
        </div>
      </div>
    );
  }

  const currentDayProgram = tour.itinerary.find(day => day.day === currentDay);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tur Başlığı ve Kategori */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{tour.title}</h1>
        <div className="flex items-center text-gray-600">
          <div className="w-4 h-4 flex items-center justify-center mr-1">
            <i className="ri-map-pin-line"></i>
          </div>
          <span>{tour.category.name}</span>
        </div>
      </div>

      {/* Fotoğraf Galerisi */}
      {/* ... bu bölüm tamamen kaldırıldı ... */}

      {/* Günlük Program Navigasyonu */}
      <div className="mb-8">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {tour.itinerary.map((day) => (
            <button
              key={day.day}
              onClick={() => setCurrentDay(day.day)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                currentDay === day.day
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Gün {day.day}: {day.title}
            </button>
          ))}
        </div>
      </div>

      {/* Günlük Program İçeriği */}
      {currentDayProgram && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sol Taraf - Program Detayları */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Gün {currentDayProgram.day}: {currentDayProgram.title}
              </h2>
              <p className="text-gray-600 mb-6">{currentDayProgram.description}</p>

              <div className="space-y-6">
                {/* Ziyaret Yerleri */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Ziyaret Yerleri</h3>
                  <ul className="space-y-2">
                    {currentDayProgram.activities.map((activity, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-6 h-6 flex items-center justify-center bg-primary text-white rounded-full mr-2 text-sm">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Öğünler */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Öğünler</h3>
                  <ul className="space-y-2">
                    {currentDayProgram.meals.map((meal, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <i className="ri-restaurant-line mr-2 text-primary"></i>
                        {meal}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Konaklama */}
                {currentDayProgram.accommodation && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Konaklama</h3>
                    <p className="text-gray-700">{currentDayProgram.accommodation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Günün Fotoğrafı ve Bilgiler */}
          <div className="space-y-6">
            {/* Günün Fotoğrafı */}
            {tour.images && tour.images.length >= currentDay && tour.images[currentDay - 1] && (
              <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-2" style={{ minHeight: 180 }}>
                  <Image
                    src={tour.images[currentDay - 1].url}
                    alt={tour.images[currentDay - 1].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-sm text-gray-700 text-center">{tour.images[currentDay - 1].title}</div>
              </div>
            )}

            {/* Fiyat ve Rezervasyon */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <span className="text-sm text-gray-500">Başlayan fiyatlarla</span>
                <div className="font-bold text-2xl text-primary">${tour.price.toLocaleString('en-US')} $</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Süre:</span>
                  <span className="font-medium">{tour.duration} Gün</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Başlangıç:</span>
                  <span className="font-medium">
                    {new Date(tour.startDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Bitiş:</span>
                  <span className="font-medium">
                    {new Date(tour.endDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kontenjan:</span>
                  <span className="font-medium">{tour.available} / {tour.capacity}</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (tour.available > 0) {
                    router.push(`/reservation/${tour.id}`);
                  } else {
                    toast.error('Bu tur için kontenjan dolmuştur');
                  }
                }}
                className={`w-full mt-6 py-3 rounded-button text-white font-medium transition-colors ${
                  tour.available > 0
                    ? 'bg-primary hover:bg-opacity-90'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {tour.available > 0 ? 'Rezervasyon Yap' : 'Kontenjan Doldu'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
} 