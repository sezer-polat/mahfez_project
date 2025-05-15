'use client';

interface TourFilterProps {
  filters: {
    location: string;
    type: string;
    date: string;
    duration: string;
  };
  onFilterChange: (filters: any) => void;
}

export function TourFilter({ filters, onFilterChange }: TourFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Tur Filtrele</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Yer
          </label>
          <select
            id="location"
            name="location"
            value={filters.location}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="">Tümü</option>
            <option value="istanbul">İstanbul</option>
            <option value="antalya">Antalya</option>
            <option value="izmir">İzmir</option>
            <option value="bodrum">Bodrum</option>
            <option value="kapadokya">Kapadokya</option>
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tur Tipi
          </label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="">Tümü</option>
            <option value="domestic">Yurt İçi</option>
            <option value="international">Yurt Dışı</option>
            <option value="daily">Günübirlik</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Tarih
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Süre
          </label>
          <select
            id="duration"
            name="duration"
            value={filters.duration}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="">Tümü</option>
            <option value="1">1 Gün</option>
            <option value="2-3">2-3 Gün</option>
            <option value="4-7">4-7 Gün</option>
            <option value="8+">8+ Gün</option>
          </select>
        </div>
      </div>
    </div>
  );
} 