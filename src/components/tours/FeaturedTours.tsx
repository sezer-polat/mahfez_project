'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  category?: { name: string };
  rating?: number;
}

export function FeaturedTours() {
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        const res = await fetch('/api/tours/featured');
        if (!res.ok) {
          throw new Error('Turlar yüklenirken bir hata oluştu');
        }
        const data = await res.json();
        setFeaturedTours(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedTours();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredTours.map((tour) => (
        <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden tour-card">
          <div className="relative h-48">
            <Image
              src={tour.image || '/images/default-tour.jpg'}
              alt={tour.title}
              fill
              className="object-cover"
            />
            {tour.rating && (
              <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
                <span className="text-primary font-semibold">⭐ {tour.rating}</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{tour.title}</h3>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {tour.duration} Gün
              </span>
            </div>
            <p className="text-gray-600 mb-4">{tour.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary">{tour.price?.toLocaleString('tr-TR')} ₺</span>
              <Link
                href={`/tours/${tour.id}`}
                className="bg-primary text-white px-4 py-2 rounded-button hover:bg-opacity-90 transition-colors"
              >
                Detaylar
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 