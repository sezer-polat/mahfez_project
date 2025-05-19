'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  startDate: string;
  endDate: string;
  image: string;
  category: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function ToursPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    }>
      <ToursContent />
    </Suspense>
  );
}

function ToursContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tours, setTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<number>(Number(searchParams.get('price')) || 10000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(searchParams.get('view') as 'grid' | 'list' || 'grid');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'date'>(searchParams.get('sort') as 'price-asc' | 'price-desc' | 'date' || 'date');
  const [showAllTours, setShowAllTours] = useState(!searchParams.get('category'));
  const [favorites, setFavorites] = useState<string[]>([]);
  const { data: session } = useSession();

  // URL parametrelerini güncelle
  const updateUrlParams = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (priceRange !== 10000) params.set('price', priceRange.toString());
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (viewMode !== 'grid') params.set('view', viewMode);
    if (sortBy !== 'date') params.set('sort', sortBy);
    
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.pushState({}, '', newUrl);
  };

  // Filtreleme yapıldığında sayfa numarasını sıfırla
  const handleFilterChange = () => {
    setCurrentPage(1);
    updateUrlParams();
  };

  // Fiyat aralığı değiştiğinde otomatik filtreleme
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFilterChange();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [priceRange]);

  // Sayfa yüklendiğinde otomatik scroll
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // URL parametreleri değiştiğinde state'i güncelle
  useEffect(() => {
    updateUrlParams();
  }, [selectedCategory, priceRange, currentPage, viewMode, sortBy]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursRes, categoriesRes] = await Promise.all([
          fetch('/api/tours'),
          fetch('/api/category')
        ]);

        if (!toursRes.ok || !categoriesRes.ok) {
          throw new Error('Veriler yüklenirken bir hata oluştu');
        }

        const [toursData, categoriesData] = await Promise.all([
          toursRes.json(),
          categoriesRes.json()
        ]);

        setTours(toursData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Favorileri getir
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/favorites');
        if (res.ok) {
          const data = await res.json();
          setFavorites(data.map((fav: any) => fav.tour.id));
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  const filteredTours = tours.filter(tour => {
    // Her zaman fiyat filtresini uygula
    const matchesPrice = tour.price <= priceRange;

    // Eğer tüm turlar seçiliyse sadece fiyat filtresini uygula
    if (showAllTours) {
      return matchesPrice;
    }

    // Kategorisi olmayan turlar da filtreye takılmasın
    const matchesCategory = !selectedCategory || (tour.category?.name === selectedCategory) || !tour.category;
    return matchesCategory && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'date':
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTours = filteredTours.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTourDetail = (tourId: string) => {
    router.push(`/tours/${tourId}`);
  };

  const handleReservation = (tourId: string) => {
    router.push(`/tours/${tourId}/rezervasyon`);
  };

  const handleToggleFavorite = async (tourId: string) => {
    if (!session?.user?.id) {
      toast.error('Favorilere eklemek için giriş yapmalısınız');
      return;
    }
    try {
      if (!favorites.includes(tourId)) {
        // Favoriye ekle
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tourId, userId: session.user.id }),
        });
        const data = await res.json();
        if (res.ok) {
          setFavorites([...favorites, tourId]);
          toast.success('Favorilere eklendi');
        } else {
          toast.error(data.error || 'Favoriye eklenemedi');
        }
      } else {
        // Favoriden çıkar
        const res = await fetch(`/api/favorites?tourId=${tourId}&userId=${session.user.id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (res.ok) {
          setFavorites(favorites.filter(id => id !== tourId));
          toast.success('Favorilerden çıkarıldı');
        } else {
          toast.error(data.error || 'Favoriden çıkarılamadı');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Chips */}
      <div className="mb-8 overflow-x-auto pb-2 hide-scrollbar">
        <div className="flex space-x-3 min-w-max">
          <button
            onClick={() => {
              setShowAllTours(!showAllTours);
              setSelectedCategory('');
              setPriceRange(10000);
              handleFilterChange();
            }}
            className={`px-4 py-2 rounded-full whitespace-nowrap shadow-sm transition-colors ${
              showAllTours
                ? 'bg-primary text-white hover:bg-opacity-90'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Tüm Turlar
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.name);
                setShowAllTours(false);
                handleFilterChange();
              }}
              className={`px-4 py-2 rounded-full whitespace-nowrap shadow-sm transition-colors ${
                selectedCategory === category.name
                  ? 'bg-primary text-white hover:bg-opacity-90'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 lg:w-72 shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Filtreler</h3>
              <button 
                onClick={() => {
                  setSelectedCategory('');
                  setPriceRange(10000);
                  handleFilterChange();
                }}
                className="text-primary text-sm hover:underline"
              >
                Temizle
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Fiyat Aralığı</h4>
              <div className="mb-2">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>$0</span>
                <span>${priceRange.toLocaleString('en-US')}</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Tour Type */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Tur Tipi</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`type-${category.id}`}
                      checked={selectedCategory === category.name}
                      onChange={() => {
                        setSelectedCategory(category.name);
                        handleFilterChange();
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor={`type-${category.id}`}
                      className="custom-checkbox"
                    ></label>
                    <label
                      htmlFor={`type-${category.id}`}
                      className="ml-2 text-gray-700 cursor-pointer"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sorting and View Controls */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="custom-select">
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'date')}
                    className="border border-gray-300 rounded-button px-3 py-1 text-sm"
                  >
                    <option value="date">Tarih</option>
                    <option value="price-asc">Fiyat (Artan)</option>
                    <option value="price-desc">Fiyat (Azalan)</option>
                  </select>
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
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-button px-2 py-1 text-sm"
              >
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="24">24</option>
              </select>
            </div>
          </div>

          {/* Tour Cards */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {currentTours.map((tour) => (
              <div key={tour.id} className={`tour-card bg-white rounded-lg shadow-sm overflow-hidden ${
                viewMode === 'list' ? 'flex' : ''
              }`}>
                <div className={`relative ${viewMode === 'list' ? 'w-1/3' : ''}`}>
                  <Image
                    src={tour.image || '/images/default-tour.jpg'}
                    alt={tour.title}
                    width={400}
                    height={250}
                    className={`w-full ${viewMode === 'list' ? 'h-full' : 'h-48'} object-cover object-top`}
                  />
                  <button
                    className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white bg-opacity-70 rounded-full transition-colors ${favorites.includes(tour.id) ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                    onClick={() => handleToggleFavorite(tour.id)}
                    aria-label="Favorilere ekle/çıkar"
                  >
                    <i className={favorites.includes(tour.id) ? 'ri-heart-fill ri-lg' : 'ri-heart-line ri-lg'}></i>
                  </button>
                </div>
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="font-semibold text-lg mb-1">{tour.title}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <div className="w-4 h-4 flex items-center justify-center mr-1">
                      <i className="ri-map-pin-line"></i>
                    </div>
                    <span className="text-sm">{tour.category?.name || 'Kategori Yok'}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-xs text-gray-500">Başlayan fiyatlarla</span>
                      <div className="font-bold text-lg text-primary">
                        ${tour.price.toLocaleString('en-US')}
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {tour.duration} Gün
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleTourDetail(tour.id)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-button hover:bg-gray-50 transition-colors"
                    >
                      Detaylar
                    </button>
                    <button 
                      onClick={() => handleReservation(tour.id)}
                      className="flex-1 bg-primary text-white py-2 rounded-button hover:bg-opacity-90 transition-colors"
                    >
                      Rezervasyon
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-1">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-arrow-left-s-line ri-lg"></i>
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded ${
                    currentPage === index + 1
                      ? 'bg-primary text-white'
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-arrow-right-s-line ri-lg"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}