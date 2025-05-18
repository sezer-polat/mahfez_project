'use client';

import Image from 'next/image';
import Link from 'next/link';

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

interface TourCardProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            {tour.type === 'domestic' ? 'Yurt İçi' : tour.type === 'international' ? 'Yurt Dışı' : 'Günübirlik'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{tour.location}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{tour.duration}</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{tour.price.toLocaleString('en-US')} $</div>
            <div className="text-sm text-gray-500">kişi başı</div>
          </div>
        </div>
        <Link
          href={`/tours/${tour.id}`}
          className="mt-4 block w-full bg-primary text-white text-center py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Detayları Gör
        </Link>
      </div>
    </div>
  );
} 