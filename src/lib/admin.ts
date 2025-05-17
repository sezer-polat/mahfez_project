import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { NextResponse } from 'next/server';

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    return false;
  }
  
  return true;
}

export async function requireAdmin() {
  const isAdminUser = await isAdmin();
  
  if (!isAdminUser) {
    return NextResponse.json(
      { error: 'Bu işlem için yetkiniz bulunmuyor.' },
      { status: 403 }
    );
  }
  
  return null;
}

export async function getAdminUser() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    return null;
  }
  
  return session.user;
} 