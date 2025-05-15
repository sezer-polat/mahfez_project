'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin kullanıcısı oluştur
  const createAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'admin123',
          name: 'Admin User',
          role: 'admin',
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Örnek tur oluştur
  const createTour = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Kapadokya Turu',
          description: 'Eşsiz doğal güzellikleri ve tarihi yapılarıyla Kapadokya turu',
          price: 2500,
          duration: '3 gün',
          location: 'Nevşehir',
          category: 'Yurt İçi',
          image: '/images/kapadokya.jpg',
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Tüm turları getir
  const getTours = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tours');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Sayfası</h1>
      
      <div className="space-y-4">
        <button
          onClick={createAdmin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          Admin Kullanıcısı Oluştur
        </button>

        <button
          onClick={createTour}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
          disabled={loading}
        >
          Örnek Tur Oluştur
        </button>

        <button
          onClick={getTours}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ml-4"
          disabled={loading}
        >
          Turları Getir
        </button>
      </div>

      {loading && <p className="mt-4">Yükleniyor...</p>}
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Sonuç:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 