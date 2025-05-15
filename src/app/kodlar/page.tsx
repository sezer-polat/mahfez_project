'use client';

import React from 'react';
import Link from 'next/link';

export default function KodlarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kodlar</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Kod Kartı 1 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="card-header">
              <h2 className="card-title">HTML Yapısı</h2>
              <p className="card-description">Temel HTML yapısı ve bileşenler</p>
            </div>
            <div className="card-content">
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{`<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Yeşil Yolculuk</title>
</head>
<body>
  <!-- İçerik buraya gelecek -->
</body>
</html>`}</code>
              </pre>
            </div>
          </div>

          {/* Kod Kartı 2 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="card-header">
              <h2 className="card-title">CSS Stilleri</h2>
              <p className="card-description">Temel CSS stilleri ve bileşenler</p>
            </div>
            <div className="card-content">
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{`.btn {
  @apply inline-flex items-center justify-center 
         rounded-button font-medium transition-colors;
}

.card {
  @apply rounded-lg border border-gray-200 
         bg-white shadow-sm;
}`}</code>
              </pre>
            </div>
          </div>

          {/* Kod Kartı 3 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="card-header">
              <h2 className="card-title">JavaScript Fonksiyonları</h2>
              <p className="card-description">Temel JavaScript fonksiyonları</p>
            </div>
            <div className="card-content">
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{`// Form doğrulama
const validateForm = (formData) => {
  const errors = {};
  if (!formData.name) {
    errors.name = 'İsim zorunludur';
  }
  return errors;
};`}</code>
              </pre>
            </div>
          </div>

          {/* Kod Kartı 4 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="card-header">
              <h2 className="card-title">API İstekleri</h2>
              <p className="card-description">API istekleri ve veri yönetimi</p>
            </div>
            <div className="card-content">
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{`// API isteği örneği
const fetchTours = async () => {
  try {
    const response = await fetch('/api/tours');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hata:', error);
  }
};`}</code>
              </pre>
            </div>
          </div>

          {/* Kod Kartı 5 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="card-header">
              <h2 className="card-title">Veritabanı Şemaları</h2>
              <p className="card-description">Veritabanı tablo yapıları</p>
            </div>
            <div className="card-content">
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{`// Kullanıcı şeması
const userSchema = {
  id: String,
  name: String,
  email: String,
  role: String,
  createdAt: Date
};`}</code>
              </pre>
            </div>
          </div>

          {/* Kod Kartı 6 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="card-header">
              <h2 className="card-title">Güvenlik Yapılandırması</h2>
              <p className="card-description">Güvenlik ayarları ve yapılandırması</p>
            </div>
            <div className="card-content">
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{`// Güvenlik middleware
const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};`}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/" className="btn btn-primary">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
} 