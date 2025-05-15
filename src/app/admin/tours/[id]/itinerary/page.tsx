'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface ItineraryDay {
  id: string;
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}

interface Tour {
  id: string;
  title: string;
  duration: number;
  itinerary: ItineraryDay[];
}

export default function ItineraryPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingDay, setEditingDay] = useState<ItineraryDay | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/giris');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/tours/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setTour(data);
        } else {
          toast.error('Tur bilgileri yüklenirken bir hata oluştu');
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
        toast.error('Tur bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'ADMIN') {
      fetchTour();
    }
  }, [session, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDay) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/tours/${params.id}/itinerary/${editingDay.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingDay),
      });

      if (response.ok) {
        const updatedDay = await response.json();
        setTour(prev => {
          if (!prev) return null;
          return {
            ...prev,
            itinerary: prev.itinerary.map(day =>
              day.id === updatedDay.id ? updatedDay : day
            ),
          };
        });
        toast.success('Günlük program başarıyla güncellendi');
        setEditingDay(null);
      } else {
        toast.error('Günlük program güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error updating itinerary:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dayId: string) => {
    try {
      const response = await fetch(`/api/admin/tours/${params.id}/itinerary/${dayId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTour(prev => {
          if (!prev) return null;
          return {
            ...prev,
            itinerary: prev.itinerary.filter(day => day.id !== dayId),
          };
        });
        toast.success('Günlük program başarıyla silindi');
        setShowDeleteModal(null);
      } else {
        toast.error('Günlük program silinirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      toast.error('Bir hata oluştu');
    }
  };

  const handleAddDay = async () => {
    if (!tour) return;

    try {
      const response = await fetch(`/api/admin/tours/${params.id}/itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${tour.itinerary.length + 1}. Gün`,
          description: '',
          activities: [],
          meals: [],
          accommodation: '',
        }),
      });

      if (response.ok) {
        const addedDay = await response.json();
        setTour(prev => {
          if (!prev) return null;
          return {
            ...prev,
            itinerary: [...prev.itinerary, addedDay],
          };
        });
        toast.success('Yeni gün başarıyla eklendi');
      } else {
        const error = await response.text();
        console.error('Error response:', error);
        toast.error('Yeni gün eklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error adding day:', error);
      toast.error('Bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tur Bulunamadı</h2>
          <Link
            href="/admin/tours"
            className="text-primary hover:text-primary-dark"
          >
            Turlara Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8 ml-64 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Günlük Program Yönetimi</h1>
            <div className="flex space-x-4">
              <Link
                href={`/admin/tours/${params.id}`}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Tura Dön
              </Link>
              <button
                onClick={handleAddDay}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <i className="ri-add-line mr-2"></i>
                Yeni Gün Ekle
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {tour.itinerary && tour.itinerary.length > 0 ? (
              tour.itinerary.map((day) => (
                <div key={day.id} className="bg-white rounded-lg shadow-md p-6">
                  {editingDay?.id === day.id ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Başlık
                        </label>
                        <input
                          type="text"
                          value={editingDay.title}
                          onChange={(e) =>
                            setEditingDay({ ...editingDay, title: e.target.value })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Açıklama
                        </label>
                        <textarea
                          value={editingDay.description}
                          onChange={(e) =>
                            setEditingDay({ ...editingDay, description: e.target.value })
                          }
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Aktiviteler (Her satıra bir aktivite)
                        </label>
                        <textarea
                          value={editingDay.activities.join('\n')}
                          onChange={(e) =>
                            setEditingDay({
                              ...editingDay,
                              activities: e.target.value.split('\n').filter(Boolean),
                            })
                          }
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Öğünler (Her satıra bir öğün)
                        </label>
                        <textarea
                          value={editingDay.meals.join('\n')}
                          onChange={(e) =>
                            setEditingDay({
                              ...editingDay,
                              meals: e.target.value.split('\n').filter(Boolean),
                            })
                          }
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Konaklama
                        </label>
                        <input
                          type="text"
                          value={editingDay.accommodation}
                          onChange={(e) =>
                            setEditingDay({ ...editingDay, accommodation: e.target.value })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                      </div>

                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setEditingDay(null)}
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
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold">{day.title}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingDay(day)}
                            className="text-primary hover:text-primary-dark"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(day.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>

                      <div className="prose max-w-none">
                        <p className="text-gray-600">{day.description}</p>

                        {day.activities.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700">Aktiviteler</h4>
                            <ul className="mt-2 list-disc list-inside">
                              {day.activities.map((activity, index) => (
                                <li key={index} className="text-gray-600">
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {day.meals.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700">Öğünler</h4>
                            <ul className="mt-2 list-disc list-inside">
                              {day.meals.map((meal, index) => (
                                <li key={index} className="text-gray-600">
                                  {meal}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {day.accommodation && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700">Konaklama</h4>
                            <p className="mt-2 text-gray-600">{day.accommodation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">Henüz günlük program eklenmemiş.</p>
                <button
                  onClick={handleAddDay}
                  className="mt-4 text-primary hover:text-primary-dark"
                >
                  İlk günü ekle
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Günü Sil</h2>
            <p className="text-gray-600 mb-6">
              Bu günü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
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