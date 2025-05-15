import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Build sürecinde veritabanı bağlantısını devre dışı bırak
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

let prisma: PrismaClient;

// Build sürecinde dummy client oluştur
if (isBuildTime) {
  prisma = {
    $connect: async () => {},
    $disconnect: async () => {},
    // Diğer gerekli metodları buraya ekleyin
  } as unknown as PrismaClient;
} else {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  // Development'ta hot reload için
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }
}

export { prisma }; 