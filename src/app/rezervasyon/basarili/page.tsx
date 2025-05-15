'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ReservationSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page after 10 seconds
    const timeout = setTimeout(() => {
      router.push('/')
    }, 10000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-line text-4xl text-green-500"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Rezervasyonunuz Alındı!
          </h1>
          <p className="text-gray-600 mb-8">
            Rezervasyon detaylarınız e-posta adresinize gönderilmiştir. En kısa sürede sizinle iletişime geçeceğiz.
          </p>
          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full bg-primary text-white py-3 rounded-button hover:bg-opacity-90 transition-colors text-center"
            >
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/turlar"
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-button hover:bg-gray-50 transition-colors text-center"
            >
              Diğer Turları Keşfet
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            10 saniye içinde ana sayfaya yönlendirileceksiniz...
          </p>
        </div>
      </div>
    </div>
  )
} 