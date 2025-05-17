'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/giris');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.replace('/admin/giris');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Yükleniyor...</div>;
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
} 