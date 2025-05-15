import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { tourIds, action, amount } = await req.json()

    if (!Array.isArray(tourIds) || tourIds.length === 0) {
      return new NextResponse('Geçersiz tur ID\'leri', { status: 400 })
    }

    if (!['INCREASE', 'DECREASE', 'SET'].includes(action)) {
      return new NextResponse('Geçersiz işlem', { status: 400 })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return new NextResponse('Geçersiz miktar', { status: 400 })
    }

    // Mevcut fiyatları al
    const tours = await prisma.tour.findMany({
      where: {
        id: {
          in: tourIds
        }
      },
      select: {
        id: true,
        price: true
      }
    })

    // Yeni fiyatları hesapla
    const updates = tours.map(tour => {
      let newPrice = tour.price
      switch (action) {
        case 'INCREASE':
          newPrice = tour.price + amount
          break
        case 'DECREASE':
          newPrice = Math.max(0, tour.price - amount)
          break
        case 'SET':
          newPrice = amount
          break
      }

      return prisma.tour.update({
        where: { id: tour.id },
        data: { price: newPrice }
      })
    })

    // Toplu güncelleme
    await Promise.all(updates)

    return NextResponse.json({
      success: true,
      message: `${tourIds.length} turun fiyatı güncellendi`
    })
  } catch (error) {
    console.error('Bulk price update error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 