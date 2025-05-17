'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  category: {
    name: string;
  };
}

export default function Home() {
  const router = useRouter();
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Slider için resimler
  const sliderImages = [
    '/images/img1.jpeg',
    '/images/img2.jpeg',
    '/images/img3.jpeg',
    '/images/img4.jpeg',
    '/images/img5.jpeg',
    '/images/img6.jpeg',
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (slideInterval.current) clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => { if (slideInterval.current) clearInterval(slideInterval.current); };
  }, [sliderImages.length]);

  const goToPrev = () => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % sliderImages.length);

  const handleTourClick = (category: string) => {
    router.push(`/tours?category=${encodeURIComponent(category)}`);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section - Slider */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Slider Images */}
        {sliderImages.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === currentSlide ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}
          >
            <Image
              src={src}
              alt={`Tanıtım Resmi ${i + 1}`}
              fill
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
        {/* Slider Overlay */}
        <div className="absolute inset-0 bg-black/50 z-30" />
        {/* Slider Content */}
        <div className="relative z-40 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">Mahfez Tur</h1>
          <p className="text-xl mb-8">Hac ve Umre Turlarında Güvenilir Adresiniz</p>
          <Link href="/tours" className="btn btn-primary text-lg px-8 py-3">
            Turları Keşfet
          </Link>
        </div>
        {/* Slider Controls */}
        <button onClick={goToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/40 text-white rounded-full p-2 hover:bg-black/70 transition"><span className="sr-only">Önceki</span>&lt;</button>
        <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/40 text-white rounded-full p-2 hover:bg-black/70 transition"><span className="sr-only">Sonraki</span>&gt;</button>
        {/* Slider Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-50">
          {sliderImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full ${i === currentSlide ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Öne Çıkan Turlar */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Öne Çıkan Turlarımız</h2>
            <Link href="/tours" className="btn btn-outline-primary">
              Tüm Turlar
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTours.map((tour) => (
                <div key={tour.id} className="card tour-card">
                  <div className="relative h-48">
                    <Image
                      src={tour.image || '/images/default-tour.jpg'}
                      alt={tour.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="card-header">
                    <h3 className="card-title">{tour.title}</h3>
                    <p className="card-description">{tour.description}</p>
                  </div>
                  <div className="card-content">
                    <ul className="space-y-2 text-gray-600">
                      <li>✓ {tour.duration} Gün</li>
                      <li>✓ {tour.category?.name || 'Kategori Yok'}</li>
                      <li>✓ ₺{tour.price?.toLocaleString('tr-TR') || tour.price}</li>
                    </ul>
                  </div>
                  <div className="card-footer">
                    <button
                      onClick={() => handleTourClick(tour.category?.name || '')}
                      className="btn btn-primary w-full"
                    >
                      Detaylı Bilgi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Neden Biz */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Neden Mahfez Tur?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Güvenilir Hizmet</h3>
              <p className="text-gray-600">20 yılı aşkın tecrübemizle güvenilir hizmet sunuyoruz</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Uzman Kadro</h3>
              <p className="text-gray-600">Deneyimli rehberlerimizle kaliteli hizmet garantisi</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Uygun Fiyat</h3>
              <p className="text-gray-600">Bütçenize uygun ödeme seçenekleri ve fiyat garantisi</p>
            </div>
          </div>
        </div>
      </section>

      {/* İletişim CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Hac ve Umre Turlarımız Hakkında Bilgi Alın</h2>
          <p className="text-lg mb-8">Size özel fiyat teklifleri ve detaylı bilgi için hemen iletişime geçin</p>
          <Link href="/iletisim" className="btn bg-white text-primary hover:bg-gray-100">
            Bize Ulaşın
          </Link>
        </div>
      </section>
    </main>
  );
} 