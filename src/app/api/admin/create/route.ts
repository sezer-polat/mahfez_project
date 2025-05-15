import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 400 }
      );
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@mahfez.com',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '5555555555',
        address: 'İstanbul'
      }
    });

    return NextResponse.json({
      message: 'Admin user created successfully',
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    return NextResponse.json(
      { message: 'Failed to create admin user' },
      { status: 500 }
    );
  }
} 