const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Admin kullanıcısı oluştur
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Örnek kategori oluştur
  const category = await prisma.category.upsert({
    where: { name: 'Yurt İçi Turlar' },
    update: {},
    create: {
      name: 'Yurt İçi Turlar',
      description: "Türkiye'nin dört bir yanına düzenlenen turlar",
    },
  });

  console.log({ admin, category });
  console.log('Seed işlemi tamamlandı!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 