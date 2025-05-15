'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface TourImage {
  id: string;
  url: string;
  title: string;
  order: number;
}

interface Tour {
  id: string;
  title: string;
  images: TourImage[];
}

export default function TourImagesPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tour, setTour] = useState<Tour | null>(null);
  const [editingImage, setEditingImage] = useState<TourImage | null>(null);
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
          
          // Eğer tur Mısır ziyaret turu ise ve henüz resim eklenmemişse, örnek resimleri ekle
          if (data.title.includes('Mısır') && (!data.images || data.images.length === 0)) {
            const sampleImages = [
              { url: '/images/img1.jpg', title: 'Piramitler' },
              { url: '/images/img2.jpg', title: 'Sfenks' },
              { url: '/images/img3.jpg', title: 'Lüksor Tapınağı' },
              { url: '/images/img4.jpg', title: 'Karnak Tapınağı' },
              { url: '/images/img5.jpg', title: 'Nil Nehri' }
            ];

            for (const image of sampleImages) {
              await fetch(`/api/admin/tours/${params.id}/images`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(image),
              });
            }

            // Resimleri yeniden yükle
            const updatedResponse = await fetch(`/api/admin/tours/${params.id}`);
            if (updatedResponse.ok) {
              const updatedData = await updatedResponse.json();
              setTour(updatedData);
            }
          }
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        const newImage = {
          url,
          title: file.name,
          order: tour?.images.length || 0,
        };

        const imageResponse = await fetch(`/api/admin/tours/${params.id}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newImage),
        });

        if (imageResponse.ok) {
          const addedImage = await imageResponse.json();
          setTour(prev => {
            if (!prev) return null;
            return {
              ...prev,
              images: [...prev.images, addedImage],
            };
          });
          toast.success('Fotoğraf başarıyla yüklendi');
        } else {
          toast.error('Fotoğraf eklenirken bir hata oluştu');
        }
      } else {
        toast.error('Fotoğraf yüklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/tours/${params.id}/images/${editingImage.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingImage),
        }
      );

      if (response.ok) {
        const updatedImage = await response.json();
        setTour(prev => {
          if (!prev) return null;
          return {
            ...prev,
            images: prev.images.map(img =>
              img.id === updatedImage.id ? updatedImage : img
            ),
          };
        });
        toast.success('Fotoğraf başarıyla güncellendi');
        setEditingImage(null);
      } else {
        toast.error('Fotoğraf güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch(
        `/api/admin/tours/${params.id}/images/${imageId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        setTour(prev => {
          if (!prev) return null;
          return {
            ...prev,
            images: prev.images.filter(img => img.id !== imageId),
          };
        });
        toast.success('Fotoğraf başarıyla silindi');
        setShowDeleteModal(null);
      } else {
        toast.error('Fotoğraf silinirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Bir hata oluştu');
    }
  };

  const handleReorder = async (imageId: string, newOrder: number) => {
    if (!tour) return;

    const image = tour.images.find(img => img.id === imageId);
    if (!image) return;

    const oldOrder = image.order;
    const updatedImages = tour.images.map(img => {
      if (img.id === imageId) {
        return { ...img, order: newOrder };
      }
      if (newOrder > oldOrder) {
        if (img.order > oldOrder && img.order <= newOrder) {
          return { ...img, order: img.order - 1 };
        }
      } else {
        if (img.order >= newOrder && img.order < oldOrder) {
          return { ...img, order: img.order + 1 };
        }
      }
      return img;
    });

    setTour(prev => {
      if (!prev) return null;
      return {
        ...prev,
        images: updatedImages.sort((a, b) => a.order - b.order),
      };
    });

    try {
      const response = await fetch(
        `/api/admin/tours/${params.id}/images/${imageId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order: newOrder }),
        }
      );

      if (!response.ok) {
        toast.error('Sıralama güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error reordering images:', error);
      toast.error('Bir hata oluştu');
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
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Fotoğraf Galerisi</h1>
            <div className="flex space-x-4">
              <Link
                href={`/admin/tours/${params.id}`}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Tura Dön
              </Link>
              <label className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer">
                <i className="ri-upload-line mr-2"></i>
                Fotoğraf Yükle
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            </div>
          </div>

          {tour && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tour.images.map((image) => (
                <div
                  key={image.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={image.url}
                      alt={image.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    {editingImage?.id === image.id ? (
                      <form onSubmit={handleUpdateImage} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Başlık
                          </label>
                          <input
                            type="text"
                            value={editingImage.title}
                            onChange={(e) =>
                              setEditingImage({
                                ...editingImage,
                                title: e.target.value,
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Sıra
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={tour.images.length - 1}
                            value={editingImage.order}
                            onChange={(e) =>
                              setEditingImage({
                                ...editingImage,
                                order: parseInt(e.target.value),
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div className="flex justify-end space-x-4">
                          <button
                            type="button"
                            onClick={() => setEditingImage(null)}
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
                        <h3 className="text-lg font-semibold mb-2">{image.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Sıra: {image.order + 1}
                        </p>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingImage(image)}
                            className="text-primary hover:text-primary-dark"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(image.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Fotoğrafı Sil</h2>
            <p className="text-gray-600 mb-6">
              Bu fotoğrafı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={() => handleDeleteImage(showDeleteModal)}
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