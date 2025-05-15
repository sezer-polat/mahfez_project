const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'admin@mahfez.com';
    const password = 'Admin123!';
    const name = 'Admin';

    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('Admin kullanıcısı zaten mevcut');
      return;
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Admin kullanıcısını oluştur
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin kullanıcısı başarıyla oluşturuldu:', user.email);
  } catch (error) {
    console.error('Admin oluşturma hatası:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 