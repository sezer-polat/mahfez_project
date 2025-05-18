'use client'

import { useState } from 'react'

export function TourFilters() {
  const [priceRange, setPriceRange] = useState(5000)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('Tüm Konumlar')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedDurations, setSelectedDurations] = useState<string[]>([])

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleDurationChange = (duration: string) => {
    setSelectedDurations(prev =>
      prev.includes(duration)
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    )
  }

  const handleClearFilters = () => {
    setPriceRange(5000)
    setSelectedDate('')
    setSelectedLocation('Tüm Konumlar')
    setSelectedTypes([])
    setSelectedDurations([])
  }

  return (
    <div className="w-full md:w-64 lg:w-72 shrink-0">
      <div className="bg-white rounded-lg shadow-sm p-5 sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Filtreler</h3>
          <button
            onClick={handleClearFilters}
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
            <span>$10000</span>
          </div>
        </div>

        {/* Date Picker */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Tarih Seçin</h4>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Konum</h4>
          <div className="custom-select w-full">
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="hidden"
              >
                <option value="Tüm Konumlar">Tüm Konumlar</option>
                <option value="istanbul">İstanbul</option>
                <option value="antalya">Antalya</option>
                <option value="izmir">İzmir</option>
                <option value="kapadokya">Kapadokya</option>
                <option value="bodrum">Bodrum</option>
              </select>
              <div className="select-selected flex items-center justify-between p-2.5">
                <span>{selectedLocation}</span>
                <i className="ri-arrow-down-s-line ri-lg"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Tour Type */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Tur Tipi</h4>
          <div className="space-y-2">
            {tourTypes.map((type) => (
              <div key={type.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={type.id}
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => handleTypeChange(type.id)}
                  className="hidden"
                />
                <label htmlFor={type.id} className="custom-checkbox"></label>
                <label
                  htmlFor={type.id}
                  className="ml-2 text-gray-700 cursor-pointer"
                >
                  {type.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Süre</h4>
          <div className="space-y-2">
            {durations.map((duration) => (
              <div key={duration.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={duration.id}
                  checked={selectedDurations.includes(duration.id)}
                  onChange={() => handleDurationChange(duration.id)}
                  className="hidden"
                />
                <label htmlFor={duration.id} className="custom-checkbox"></label>
                <label
                  htmlFor={duration.id}
                  className="ml-2 text-gray-700 cursor-pointer"
                >
                  {duration.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            // Apply filters
            console.log({
              priceRange,
              selectedDate,
              selectedLocation,
              selectedTypes,
              selectedDurations,
            })
          }}
          className="w-full bg-primary text-white py-2.5 rounded-button hover:bg-opacity-90 transition-colors"
        >
          Filtreleri Uygula
        </button>
      </div>
    </div>
  )
}

const tourTypes = [
  { id: 'kultur', name: 'Kültür Turu' },
  { id: 'doga', name: 'Doğa Turu' },
  { id: 'gastronomi', name: 'Gastronomi Turu' },
  { id: 'macera', name: 'Macera Turu' },
  { id: 'plaj', name: 'Plaj Turu' },
]

const durations = [
  { id: 'gunubirlik', name: 'Günübirlik' },
  { id: '2-3', name: '2-3 Gün' },
  { id: '4-7', name: '4-7 Gün' },
  { id: '7+', name: '7+ Gün' },
] 