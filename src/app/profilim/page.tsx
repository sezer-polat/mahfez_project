'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

interface Tab {
  id: string;
  label: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
}

interface Reservation {
  id: string;
  tour: {
    title: string;
    image: string;
    startDate: string;
    endDate: string;
  };
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  numberOfPeople: number;
  totalPrice: number;
  createdAt: string;
}

interface Favorite {
  id: string;
  tour: {
    id: string;
    title: string;
    image: string;
    price: number;
    startDate: string;
    endDate: string;
  };
  createdAt: string;
}

const tabs: Tab[] = [
  { id: 'profil', label: 'Profil Bilgileri' },
  { id: 'rezervasyonlar', label: 'Rezervasyonlarım' },
  { id: 'favoriler', label: 'Favorilerim' },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profil');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData();
      fetchReservations();
      fetchFavorites();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setFormData({
          name: data.name,
          phone: data.phone || '',
          address: data.address || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Kullanıcı bilgileri yüklenirken bir hata oluştu');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
        toast.success('Profil bilgileri güncellendi');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Profil güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Profil güncellenirken bir hata oluştu');
    }
  };

  const fetchReservations = async () => {
    try {
      console.log('Fetching reservations...'); // Debug log
      const response = await fetch('/api/reservations');
      console.log('Response status:', response.status); // Debug log
      
      if (response.ok) {
        const data = await response.json();
        console.log('Received reservations:', data); // Debug log
        setReservations(data);
      } else {
        console.error('Failed to fetch reservations:', response.statusText);
        toast.error('Rezervasyonlar yüklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Rezervasyonlar yüklenirken bir hata oluştu');
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Favoriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id: string) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });

      if (response.ok) {
        setReservations(reservations.map(reservation =>
          reservation.id === id ? { ...reservation, status: 'CANCELLED' } : reservation
        ));
        toast.success('Rezervasyon başarıyla iptal edildi');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Rezervasyon iptal edilirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast.error('Rezervasyon iptal edilirken bir hata oluştu');
    }
  };

  const handleRemoveFavorite = async (tourId: string) => {
    try {
      const response = await fetch(`/api/favorites?tourId=${tourId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.tour.id !== tourId));
        toast.success('Favorilerden kaldırıldı');
      } else {
        toast.error('Favori kaldırılırken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Favori kaldırılırken bir hata oluştu');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Onaylandı';
      case 'CANCELLED':
        return 'İptal Edildi';
      default:
        return 'Beklemede';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/giris');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Profilim</h1>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'profil' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Profil Bilgileri</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-primary hover:text-primary-dark"
                      >
                        Düzenle
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Ad Soyad
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          E-posta
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={user?.email || ''}
                          disabled
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Adres
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              name: user?.name || '',
                              phone: user?.phone || '',
                              address: user?.address || '',
                            });
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          İptal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark"
                        >
                          Kaydet
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Ad Soyad</h3>
                        <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">E-posta</h3>
                        <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Telefon</h3>
                        <p className="mt-1 text-sm text-gray-900">{user?.phone || '-'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Adres</h3>
                        <p className="mt-1 text-sm text-gray-900">{user?.address || '-'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'rezervasyonlar' && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Rezervasyonlarım</h2>
                  {reservations.length === 0 ? (
                    <p className="text-gray-500">Henüz rezervasyonunuz bulunmuyor.</p>
                  ) : (
                    <div className="space-y-4">
                      {reservations.map((reservation) => (
                        reservation.tour ? (
                          <div key={reservation.id} className="border rounded-lg p-4">
                            <div className="flex items-start space-x-4">
                              <div className="relative h-24 w-24 flex-shrink-0">
                                <Image
                                  src={reservation.tour.image || '/images/default-tour.jpg'}
                                  alt={reservation.tour.title || 'Tur'}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{reservation.tour.title || 'Tur Bilgisi Yok'}</h3>
                                <p className="text-sm text-gray-500">
                                  {reservation.tour.startDate ? new Date(reservation.tour.startDate).toLocaleDateString('tr-TR') : ''} -{' '}
                                  {reservation.tour.endDate ? new Date(reservation.tour.endDate).toLocaleDateString('tr-TR') : ''}
                                </p>
                                <div className="mt-2 flex items-center justify-between">
                                  <div>
                                    <p className="text-sm">
                                      <span className="font-medium">Kişi Sayısı:</span> {reservation.numberOfPeople}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Toplam Tutar:</span>{' '}
                                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(reservation.totalPrice)}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end space-y-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                                      {getStatusText(reservation.status)}
                                    </span>
                                    {reservation.status === 'CONFIRMED' && (
                                      <button
                                        onClick={() => handleCancelReservation(reservation.id)}
                                        className="text-sm text-red-600 hover:text-red-800"
                                      >
                                        İptal Et
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favoriler' && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Favorilerim</h2>
                  {favorites.length === 0 ? (
                    <p className="text-gray-500">Henüz favori turunuz bulunmuyor.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites.map((favorite) => (
                        favorite.tour ? (
                          <div key={favorite.id} className="border rounded-lg overflow-hidden">
                            <div className="relative h-48">
                              <Image
                                src={favorite.tour.image || '/images/default-tour.jpg'}
                                alt={favorite.tour.title || 'Tur'}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold mb-2">{favorite.tour.title || 'Tur Bilgisi Yok'}</h3>
                              <p className="text-sm text-gray-500 mb-2">
                                {favorite.tour.startDate ? new Date(favorite.tour.startDate).toLocaleDateString('tr-TR') : ''} -{' '}
                                {favorite.tour.endDate ? new Date(favorite.tour.endDate).toLocaleDateString('tr-TR') : ''}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="font-medium">
                                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(favorite.tour.price)}
                                </p>
                                <div className="space-x-2">
                                  <Link
                                    href={`/tours/${favorite.tour.id}`}
                                    className="text-primary hover:text-primary-dark"
                                  >
                                    Detaylar
                                  </Link>
                                  <button
                                    onClick={() => handleRemoveFavorite(favorite.tour.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    Kaldır
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 