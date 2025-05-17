'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Sidebar from '../Sidebar'

export default function BulkEmailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    filters: {
      role: 'USER'
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/bulk-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Bir hata oluştu')
      }

      setSuccess(data.message)
      setFormData({
        subject: '',
        content: '',
        filters: {
          role: 'USER'
        }
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          <h1 className="text-2xl font-bold mb-8">Toplu E-posta Gönderimi</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{success}</span>
                </div>
              )}

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Konu
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  İçerik
                </label>
                <textarea
                  id="content"
                  required
                  rows={10}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Kullanıcı adını eklemek için {'{name}'} kullanabilirsiniz.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Filtreler</h3>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Kullanıcı Rolü
                  </label>
                  <select
                    id="role"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    value={formData.filters.role}
                    onChange={(e) => setFormData({
                      ...formData,
                      filters: { ...formData.filters, role: e.target.value }
                    })}
                  >
                    <option value="USER">Normal Kullanıcılar</option>
                    <option value="ADMIN">Yöneticiler</option>
                    <option value="ALL">Tüm Kullanıcılar</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {loading ? 'Gönderiliyor...' : 'E-postaları Gönder'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    )
  }

  return null
} 