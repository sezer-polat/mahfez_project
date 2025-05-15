'use client';

import { useState } from 'react';
import { TourCard } from './TourCard';
import { TourFilter } from './TourFilter';
import Image from 'next/image';
import Link from 'next/link';

const allTours = [
  {
    id: '1',
    title: 'Kapadokya Turu',
    description: 'Eşsiz peri bacaları ve sıcak hava balonları ile unutulmaz bir deneyim.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd',
    location: 'Nevşehir',
    duration: '3 Gün',
    type: 'domestic' as const,
  },
  {
    id: '2',
    title: 'Antalya Turu',
    description: 'Turkuaz sahiller ve antik kentler ile dolu bir tatil.',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1512132411229-c30391241dd8',
    location: 'Antalya',
    duration: '5 Gün',
    type: 'domestic' as const,
  },
  {
    id: '3',
    title: 'İstanbul Turu',
    description: 'İki kıtayı birleştiren eşsiz şehirde tarihi keşfedin.',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200',
    location: 'İstanbul',
    duration: '2 Gün',
    type: 'domestic' as const,
  },
  {
    id: '4',
    title: 'Bodrum Turu',
    description: 'Masmavi koylar ve tarihi kaleler ile dolu bir yaz tatili.',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1610730260505-0b9ed7f06293',
    location: 'Bodrum',
    duration: '7 Gün',
    type: 'domestic' as const,
  },
  {
    id: '5',
    title: 'Paris Turu',
    description: 'Aşk şehrinde romantik bir hafta sonu.',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    location: 'Paris',
    duration: '4 Gün',
    type: 'international' as const,
  },
  {
    id: '6',
    title: 'Roma Turu',
    description: 'Antik Roma\'nın ihtişamını keşfedin.',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
    location: 'Roma',
    duration: '5 Gün',
    type: 'international' as const,
  },
];

export function TourList() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [perPage, setPerPage] = useState(12);

  const filteredTours = allTours.filter((tour) => {
    if (sortBy === 'popular') {
      return true;
    }
    if (sortBy === 'price-asc') {
      return tour.price >= 1000 && tour.price <= 5000;
    }
    if (sortBy === 'price-desc') {
      return tour.price >= 5000 && tour.price <= 10000;
    }
    if (sortBy === 'date') {
      const [min, max] = sortBy.split('-').map(Number);
      const tourDuration = parseInt(tour.duration);
      if (max) {
        if (tourDuration < min || tourDuration > max) {
          return false;
        }
      } else {
        if (tourDuration < min) {
          return false;
        }
      }
    }
    return true;
  });

  return (
    <div className="flex-1">
      {/* Sorting and View Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="custom-select">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="hidden"
              >
                <option value="popular">Popülerlik</option>
                <option value="price-asc">Fiyat (Artan)</option>
                <option value="price-desc">Fiyat (Azalan)</option>
                <option value="date">Tarih</option>
              </select>
              <div className="select-selected flex items-center justify-between p-2 min-w-[160px]">
                <span>
                  {sortBy === 'popular' && 'Popülerlik'}
                  {sortBy === 'price-asc' && 'Fiyat (Artan)'}
                  {sortBy === 'price-desc' && 'Fiyat (Azalan)'}
                  {sortBy === 'date' && 'Tarih'}
                </span>
                <i className="ri-arrow-down-s-line ri-lg"></i>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Görünüm:</span>
            <div className="flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-l-button ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <i className="ri-layout-grid-line ri-lg"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-r-button ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <i className="ri-list-check-line ri-lg"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sayfa başına:</span>
          <div className="custom-select">
            <div className="relative">
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="hidden"
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
              </select>
              <div className="select-selected flex items-center justify-between p-2 min-w-[80px]">
                <span>{perPage}</span>
                <i className="ri-arrow-down-s-line ri-lg"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Cards */}
      <div
        className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        }`}
      >
        {filteredTours.map((tour) => (
          <div
            key={tour.id}
            className="tour-card bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="relative">
              <Image
                src={tour.image}
                alt={tour.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover object-top"
              />
              <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white bg-opacity-70 rounded-full text-gray-600 hover:text-primary transition-colors">
                <i className="ri-heart-line ri-lg"></i>
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{tour.title}</h3>
              <div className="flex items-center text-gray-600 mb-3">
                <div className="w-4 h-4 flex items-center justify-center mr-1">
                  <i className="ri-map-pin-line"></i>
                </div>
                <span className="text-sm">{tour.location}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-xs text-gray-500">Başlayan fiyatlarla</span>
                  <div className="font-bold text-lg text-primary">{tour.price} ₺</div>
                </div>
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {tour.duration}
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/turlar/${tour.id}`}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-button hover:bg-gray-50 transition-colors text-center"
                >
                  Detaylar
                </Link>
                <Link
                  href={`/turlar/${tour.id}/rezervasyon`}
                  className="flex-1 bg-primary text-white py-2 rounded-button hover:bg-opacity-90 transition-colors text-center"
                >
                  Rezervasyon
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-1">
          <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50">
            <i className="ri-arrow-left-s-line ri-lg"></i>
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-10 h-10 flex items-center justify-center rounded ${
                page === 1
                  ? 'bg-primary text-white'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50">
            <i className="ri-arrow-right-s-line ri-lg"></i>
          </button>
        </nav>
      </div>
    </div>
  );
} 