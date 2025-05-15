'use client';

import Image from 'next/image';
import Link from 'next/link';

const specialOffers = [
  {
    id: 1,
    title: 'Erken Rezervasyon Fırsatı',
    description: 'Kapadokya Turu - %20 İndirim',
    originalPrice: '3.999',
    discountedPrice: '2.999',
    image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd',
    validUntil: '31 Mart 2024',
  },
  {
    id: 2,
    title: 'Son Dakika Fırsatı',
    description: 'Ege Turu - %15 İndirim',
    originalPrice: '4.999',
    discountedPrice: '3.499',
    image: 'https://images.unsplash.com/photo-1610730260505-0b9ed7f06293',
    validUntil: '15 Nisan 2024',
  },
];

export function SpecialOffers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {specialOffers.map((offer) => (
        <div key={offer.id} className="bg-white rounded-lg shadow-md overflow-hidden tour-card">
          <div className="relative h-64">
            <Image
              src={offer.image}
              alt={offer.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
              <p className="text-lg mb-4">{offer.description}</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold">{offer.discountedPrice} ₺</span>
                <span className="text-lg line-through opacity-75">{offer.originalPrice} ₺</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Son Geçerlilik: {offer.validUntil}</span>
                <Link
                  href={`/tours/${offer.id}`}
                  className="bg-white text-primary px-6 py-2 rounded-button hover:bg-gray-100 transition-colors"
                >
                  Hemen Rezervasyon Yap
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 