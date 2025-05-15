import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, validatePassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Input validation
    if (!email || !password || !name) {
      console.error('Missing required fields:', { email: !!email, password: !!password, name: !!name });
      return NextResponse.json(
        { error: 'Email, şifre ve isim zorunludur' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email);
      return NextResponse.json(
        { error: 'Geçersiz email formatı' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      console.error('Password validation failed:', passwordValidation.message);
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error('User already exists:', email);
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanılıyor' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER',
      },
    });

    console.log('User created successfully:', { userId: user.id, email: user.email });

    return NextResponse.json(
      { message: 'Kullanıcı başarıyla oluşturuldu', userId: user.id },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    // Check for specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Bu email adresi zaten kullanılıyor' },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    return NextResponse.json(
      { error: 'Kayıt işlemi sırasında bir hata oluştu' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
} 