import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only check for DATABASE_URL in production
if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy'
    }
  }
});

// Development'ta hot reload için
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} 