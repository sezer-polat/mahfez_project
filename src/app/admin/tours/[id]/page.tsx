'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Sidebar from '../../Sidebar';

interface Category {
  id: string;
  name: string;
}

interface FormDataType {
  title: string;
  description: string;
  price: string;
  duration: string;
  categoryId: string;
  image: string;
  capacity: string;
  available: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  categoryId: string;
  image: string;
  startDate?: string;
  endDate?: string;
  capacity: number;
  available: number;
  isActive: boolean;
  images: {
    id: string;
    url: string;
    title: string;
  }[];
  itinerary: {
    id: string;
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation: string;
  }[];
}

export default function EditTourPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    description: '',
    price: '',
    duration: '',
    categoryId: '',
    image: '',
    capacity: '20',
    available: '20',
    startDate: '',
    endDate: '',
    isActive: true
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tour, setTour] = useState<Tour | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/giris');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tourResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/admin/tours/${params.id}`),
          fetch('/api/admin/categories'),
        ]);

        if (tourResponse.ok && categoriesResponse.ok) {
          const tourData: Tour = await tourResponse.json();
          const categoriesData: Category[] = await categoriesResponse.json();

          setTour(tourData);
          setFormData({
            title: tourData.title,
            description: tourData.description,
            price: tourData.price.toString(),
            duration: tourData.duration.toString(),
            categoryId: tourData.categoryId,
            image: tourData.image,
            capacity: tourData.capacity.toString(),
            available: tourData.available.toString(),
            startDate: tourData.startDate ? tourData.startDate.split('T')[0] : '',
            endDate: tourData.endDate ? tourData.endDate.split('T')[0] : '',
            isActive: tourData.isActive
          });
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Veriler yüklenirken bir hata oluştu');
      }
    };

    if (session?.user?.role === 'ADMIN') {
      fetchData();
    }
  }, [session, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        capacity: parseInt(formData.capacity),
        available: parseInt(formData.available)
      };

      const response = await fetch(`/api/admin/tours/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success('Tur başarıyla güncellendi');
        router.push('/admin/tours');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Error updating tour:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({ ...prev, image: data.url }));
          toast.success('Görsel başarıyla yüklendi');
        } else {
          toast.error('Görsel yüklenirken bir hata oluştu');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Görsel yüklenirken bir hata oluştu');
      }
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8 ml-64 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Tur Detayları</h1>
            <div className="flex space-x-4">
              <Link
                href={`/admin/tours/${params.id}/images`}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <i className="ri-image-line mr-2"></i>
                Fotoğraf Galerisi
              </Link>
              <Link
                href={`/admin/tours/${params.id}/itinerary`}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <i className="ri-calendar-line mr-2"></i>
                Program Yönetimi
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <i className="ri-delete-bin-line mr-2"></i>
                Turu Sil
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Tur Adı
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                    Kategori
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Fiyat ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Süre (Gün)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    required
                    min="1"
                    value={formData.duration}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    required
                    value={formData.endDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                    Tur Kapasitesi
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => {
                      const newCapacity = e.target.value;
                      setFormData({
                        ...formData,
                        capacity: newCapacity,
                        available: newCapacity
                      });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="available" className="block text-sm font-medium text-gray-700">
                    Mevcut Boş Kontenjan
                  </label>
                  <input
                    type="number"
                    id="available"
                    name="available"
                    required
                    min="0"
                    value={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>

              <div className="mt-6">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Ana Görsel
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  {formData.image && (
                    <div className="relative w-32 h-32">
                      <Image
                        src={formData.image}
                        alt="Tur görseli"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-white
                      hover:file:bg-primary-dark"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Yeni bir görsel seçmezseniz mevcut görsel korunacaktır.
                </p>
              </div>

              <div className="mt-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Tur Aktif</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>

          {/* Fotoğraf Galerisi */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Fotoğraf Galerisi</h2>
              <Link
                href={`/admin/tours/${params.id}/images`}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <i className="ri-image-line mr-2"></i>
                Fotoğrafları Yönet
              </Link>
            </div>
            {tour?.images && tour.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tour.images.map((image) => (
                  <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                      <p className="text-sm truncate">{image.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Henüz fotoğraf eklenmemiş</p>
                <Link
                  href={`/admin/tours/${params.id}/images`}
                  className="text-primary hover:text-primary-dark mt-2 inline-block"
                >
                  Fotoğraf ekle
                </Link>
              </div>
            )}
          </div>

          {/* Günlük Program */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Günlük Program</h2>
              <Link
                href={`/admin/tours/${params.id}/itinerary`}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <i className="ri-calendar-line mr-2"></i>
                Programı Yönet
              </Link>
            </div>
            {tour?.itinerary && tour.itinerary.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tour.itinerary.map((day) => (
                  <div key={day.id} className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">{day.title}</h3>
                    <p className="text-gray-600">{day.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Henüz program eklenmemiş</p>
                <Link
                  href={`/admin/tours/${params.id}/itinerary`}
                  className="text-primary hover:text-primary-dark mt-2 inline-block"
                >
                  Program ekle
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Turu Sil</h2>
            <p className="text-gray-600 mb-6">
              Bu turu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/admin/tours/${params.id}`, {
                      method: 'DELETE',
                    });

                    if (response.ok) {
                      toast.success('Tur başarıyla silindi');
                      router.push('/admin/tours');
                    } else {
                      toast.error('Tur silinirken bir hata oluştu');
                    }
                  } catch (error) {
                    console.error('Error deleting tour:', error);
                    toast.error('Bir hata oluştu');
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 