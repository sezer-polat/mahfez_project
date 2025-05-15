'use client';

import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Hakkımızda</h1>

        {/* Hero Section */}
        <div className="relative h-[400px] mb-12 rounded-xl overflow-hidden">
          <Image
            src="/images/about-hero.jpg"
            alt="Mahfez Tur"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">20 Yıllık Deneyim</h2>
              <p className="text-xl">Hac ve Umre Turlarında Güvenilir Adresiniz</p>
            </div>
          </div>
        </div>

        {/* Misyon ve Vizyon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">Misyonumuz</h2>
            <p className="text-gray-600">
              Müşterilerimize güvenilir, konforlu ve unutulmaz bir hac/umre deneyimi sunmak için 
              çalışıyoruz. Her adımda kalite ve müşteri memnuniyetini ön planda tutuyoruz.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">Vizyonumuz</h2>
            <p className="text-gray-600">
              Hac ve umre turları alanında lider konumumuzu sürdürerek, müşterilerimize en kaliteli 
              hizmeti sunmaya devam etmek ve bu kutsal yolculuklarını unutulmaz kılmak.
            </p>
          </div>
        </div>

        {/* Neden Biz */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-8 text-center">Neden Biz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-team-line text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Deneyimli Ekip</h3>
              <p className="text-gray-600">
                Alanında uzman ve deneyimli rehber kadromuzla hizmetinizdeyiz.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shield-check-line text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Güvenilir Hizmet</h3>
              <p className="text-gray-600">
                Tüm süreçlerde şeffaf ve güvenilir bir yaklaşım benimsiyoruz.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-hotel-line text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Kaliteli Konaklama</h3>
              <p className="text-gray-600">
                Seçkin otellerde konforlu konaklama imkanı sunuyoruz.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-customer-service-2-line text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">7/24 Destek</h3>
              <p className="text-gray-600">
                Tüm süreç boyunca yanınızdayız.
              </p>
            </div>
          </div>
        </div>

        {/* Değerlerimiz */}
        <div>
          <h2 className="text-2xl font-semibold mb-8 text-center">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold mb-4">Güvenilirlik</h3>
              <p className="text-gray-600">
                Müşterilerimize karşı her zaman dürüst ve şeffaf bir yaklaşım benimsiyoruz. 
                Tüm süreçlerde güvenilirliğimizi korumak için çalışıyoruz.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold mb-4">Kalite</h3>
              <p className="text-gray-600">
                Hizmetlerimizde en yüksek kalite standartlarını hedefliyoruz. 
                Her detayı özenle planlıyor ve uyguluyoruz.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold mb-4">Müşteri Memnuniyeti</h3>
              <p className="text-gray-600">
                Müşterilerimizin memnuniyeti bizim için en önemli önceliktir. 
                Her müşterimizin beklentilerini aşmak için çalışıyoruz.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold mb-4">Sürekli Gelişim</h3>
              <p className="text-gray-600">
                Hizmetlerimizi sürekli geliştirerek daha iyiye ulaşmayı hedefliyoruz. 
                Yenilikleri takip ediyor ve uyguluyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 