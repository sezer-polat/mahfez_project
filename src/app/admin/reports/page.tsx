'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '../Sidebar';

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reportType: 'reservations',
    format: 'excel'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const queryParams = new URLSearchParams({
        startDate: formData.startDate,
        endDate: formData.endDate,
        type: formData.reportType,
        format: formData.format
      });

      const response = await fetch(`/api/admin/reports?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Rapor oluşturulurken bir hata oluştu');
      }

      // Dosyayı indir
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.reportType}-report-${new Date().toISOString()}.${formData.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 pl-[150px]">
          <div className="max-w-[1800px] mx-auto px-8 py-8">
            <h1 className="text-2xl font-bold mb-8">Raporlar</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Başlangıç Tarihi
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
                      Rapor Türü
                    </label>
                    <select
                      id="reportType"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      value={formData.reportType}
                      onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                    >
                      <option value="reservations">Rezervasyon Raporu</option>
                      <option value="tours">Tur Raporu</option>
                      <option value="financial">Finansal Rapor</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                      Format
                    </label>
                    <select
                      id="format"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      value={formData.format}
                      onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    >
                      <option value="excel">Excel</option>
                      <option value="pdf">PDF</option>
                    </select>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {loading ? 'Rapor Oluşturuluyor...' : 'Rapor Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
} 