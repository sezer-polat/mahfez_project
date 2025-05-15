'use client';

import Image from 'next/image';
import Link from 'next/link';

const featuredTours = [
  {
    id: 1,
    title: 'Kapadokya Turu',
    description: 'Eşsiz peri bacaları ve sıcak hava balonu deneyimi',
    price: '2.999',
    duration: '3 Gün',
    image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd',
    location: 'Nevşehir',
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Ege Turu',
    description: 'Antik kentler ve muhteşem plajlar',
    price: '3.499',
    duration: '5 Gün',
    image: 'https://images.unsplash.com/photo-1610730260505-0b9ed7f06293',
    location: 'İzmir',
    rating: 4.9,
  },
  {
    id: 3,
    title: 'Akdeniz Turu',
    description: 'Turkuaz sahiller ve tarihi yerler',
    price: '4.999',
    duration: '7 Gün',
    image: 'https://images.unsplash.com/photo-1512132411229-c30391241dd8',
    location: 'Antalya',
    rating: 4.7,
  },
];

export function FeaturedTours() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredTours.map((tour) => (
        <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden tour-card">
          <div className="relative h-48">
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
              <span className="text-primary font-semibold">⭐ {tour.rating}</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{tour.title}</h3>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {tour.duration}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{tour.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary">{tour.price} ₺</span>
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