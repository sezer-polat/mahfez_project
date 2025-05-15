'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Loading from './loading';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/giris') {
      router.replace('/admin/giris');
    }
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status, router, pathname]);

  if (pathname === '/admin/giris') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 pl-64">
        <div className="p-8">
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
} 