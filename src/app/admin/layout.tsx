'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 pl-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
} 