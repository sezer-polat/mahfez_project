import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Önce mevcut admin kullanıcısını kontrol et
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: 'admin@example.com'
      }
    });

    if (existingAdmin) {
      console.log('Admin kullanıcısı zaten mevcut.');
      return;
    }

    // Şifreyi hashle
    const hashedPassword = await hash('Admin123!', 12);

    // Admin kullanıcısını oluştur
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '5555555555',
        address: 'Admin Address'
      }
    });

    console.log('Admin kullanıcısı başarıyla oluşturuldu:', admin);
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 