import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Loading from './loading';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/giris');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 pl-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
} 