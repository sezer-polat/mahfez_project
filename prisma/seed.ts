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
        instagram: '@https://www.instagram.com/mahfezturizm/',
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