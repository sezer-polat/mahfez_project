'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import Sidebar from '@/components/admin/Sidebar'

interface Stats {
  totalReservations: number
  pendingReservations: number
  confirmedReservations: number
  cancelledReservations: number
  totalRevenue: number
  lastWeekReservations: number
  recentBookings: Array<{
    id: string
    firstName: string
    lastName: string
    numberOfPeople: number
    totalPrice: number
    status: string
    createdAt: string
    tour: {
      title: string
      image: string
      startDate: string
      endDate: string
    }
  }>
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/')
    }
  }, [session, status, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (!response.ok) throw new Error('İstatistikler alınamadı')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('İstatistik hatası:', error)
        toast.error('İstatistikler yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.role === 'ADMIN') {
      fetchStats()
    }
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Veri yüklenemedi</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 pl-[150px]">
        <div className="max-w-[1800px] mx-auto px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">Yönetim Paneli</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Toplam Rezervasyon</h3>
              <p className="text-3xl font-bold">{stats.totalReservations}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Bekleyen Rezervasyonlar</h3>
              <p className="text-3xl font-bold text-yellow-500">{stats.pendingReservations}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Onaylanan Rezervasyonlar</h3>
              <p className="text-3xl font-bold text-green-500">{stats.confirmedReservations}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Toplam Gelir</h3>
              <p className="text-3xl font-bold text-blue-500">
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.totalRevenue)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Son Rezervasyonlar</h2>
              <div className="space-y-4">
                {stats.recentBookings.length > 0 ? (
                  stats.recentBookings.map((booking) => (
                    <div key={booking.id} className="border-b pb-4">
                      <p className="font-medium">{booking.tour.title}</p>
                      <p className="text-sm text-gray-600">
                        {booking.firstName} {booking.lastName} - {format(new Date(booking.createdAt), 'dd MMMM yyyy HH:mm', { locale: tr })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Henüz rezervasyon bulunmuyor</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 