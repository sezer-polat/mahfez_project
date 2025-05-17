import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin kullanıcısı oluştur
  const adminPassword = await hash('Admin123!', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mahfez.com' },
    update: {},
    create: {
      email: 'admin@mahfez.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      phone: '5555555555',
      address: 'Admin Address'
    },
  })

  // Normal kullanıcılar
  const userPassword = await hash('user123', 12)
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'ahmet@example.com' },
      update: {},
      create: {
        email: 'ahmet@example.com',
        name: 'Ahmet Yılmaz',
        password: userPassword,
        role: 'USER',
        phone: '5551234568',
        address: 'Ankara, Türkiye'
      },
    }),
    prisma.user.upsert({
      where: { email: 'ayse@example.com' },
      update: {},
      create: {
        email: 'ayse@example.com',
        name: 'Ayşe Demir',
        password: userPassword,
        role: 'USER',
        phone: '5551234569',
        address: 'İzmir, Türkiye'
      },
    }),
  ])

  // Varsayılan ayarları oluştur
  const settings = await prisma.settings.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      siteName: 'Tur Rezervasyon Sistemi',
      siteDescription: 'En iyi turlar, en uygun fiyatlarla!',
      contactEmail: 'info@example.com',
      contactPhone: '+90 555 123 4567',
      address: 'İstanbul, Türkiye',
      socialMedia: {
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        instagram: 'https://www.instagram.com/mahfezturizm/',
      },
    },
  })

  // Kategoriler
  const categories = [
    {
      name: 'Hac Turları',
      description: 'Hac turları ve organizasyonları',
      updatedAt: new Date()
    },
    {
      name: 'Umre Turları',
      description: 'Umre turları ve organizasyonları',
      updatedAt: new Date()
    },
    {
      name: 'Kültür Turları',
      description: 'Kültür ve gezi turları',
      updatedAt: new Date()
    }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  // Kategorilerden birini al
  const category = await prisma.category.findFirst();

  // Tur ekle
  const tour = await prisma.tour.create({
    data: {
      title: 'Örnek Tur',
      description: 'Bu bir örnek tur açıklamasıdır.',
      price: 5000,
      duration: 7,
      image: 'https://placehold.co/600x400',
      categoryId: category?.id || '',
      capacity: 30,
      available: 30,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-07'),
      isActive: true,
    },
  });

  // Reservation ekle
  await prisma.reservation.create({
    data: {
      tourId: tour.id,
      userId: users[0].id,
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet@example.com',
      phone: '5551234568',
      address: 'Ankara, Türkiye',
      city: 'Ankara',
      country: 'Türkiye',
      numberOfPeople: 2,
      status: 'CONFIRMED',
      totalPrice: 10000,
      specialRequests: 'Vegan yemek',
    },
  });

  // Favorite ekle
  await prisma.favorite.create({
    data: {
      userId: users[0].id,
      tourId: tour.id,
    },
  });

  // Contact ekle
  await prisma.contact.create({
    data: {
      name: 'Ziyaretçi',
      email: 'ziyaretci@example.com',
      subject: 'Bilgi Talebi',
      message: 'Tur hakkında bilgi almak istiyorum.',
    },
  });

  // ContactMessage ekle
  await prisma.contactMessage.create({
    data: {
      name: 'Ziyaretçi',
      email: 'ziyaretci@example.com',
      phone: '5550000000',
      subject: 'İletişim',
      message: 'Merhaba, iletişime geçmek istiyorum.',
    },
  });

  // Itinerary ekle
  await prisma.itinerary.create({
    data: {
      tourId: tour.id,
      day: 1,
      title: '1. Gün',
      description: 'Varış ve otele yerleşme.',
      activities: ['Otele giriş', 'Serbest zaman'],
      meals: ['Akşam yemeği'],
      accommodation: 'Otel',
    },
  });

  // TourImage ekle
  await prisma.tourImage.create({
    data: {
      tourId: tour.id,
      url: 'https://placehold.co/600x400',
      title: 'Tur Görseli',
      order: 1,
    },
  });

  // SliderImage ekle
  await prisma.sliderImage.create({
    data: {
      url: 'https://placehold.co/1200x400',
      title: 'Ana Slider',
      description: 'Ana sayfa slider görseli',
      order: 1,
    },
  });

  console.log({ admin, users, settings, categories })
  console.log('Seed işlemi tamamlandı!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 