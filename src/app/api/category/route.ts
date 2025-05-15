import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Kategorileri listele ve yeni kategori ekle
export async function GET() {
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { name, description } = data;
  if (!name) {
    return NextResponse.json({ error: 'Kategori adı zorunludur.' }, { status: 400 });
  }
  const category = await prisma.category.create({
    data: { 
      name, 
      description,
      updatedAt: new Date()
    },
  });
  return NextResponse.json(category, { status: 201 });
} 