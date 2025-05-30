'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest
    })
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex justify-center">
            <i className="ri-error-warning-line text-red-500 text-6xl"></i>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Bir Hata Oluştu
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Üzgünüz, bir şeyler yanlış gitti. Lütfen tekrar deneyin.
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Hata Detayları
              </span>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700">
                Hata Mesajı: {error.message}
              </p>
              {error.digest && (
                <p className="text-sm text-red-700 mt-2">
                  Hata Kodu: {error.digest}
                </p>
              )}
              {error.stack && (
                <pre className="text-xs text-red-700 mt-2 overflow-auto">
                  {error.stack}
                </pre>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={reset}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <i className="ri-refresh-line mr-2"></i>
              Tekrar Dene
            </button>
            <Link
              href="/"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <i className="ri-home-line mr-2"></i>
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/iletisim"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <i className="ri-customer-service-line mr-2"></i>
              Yardım Al
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 