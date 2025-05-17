import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/giris');
  }

  if (session.user?.role !== 'ADMIN') {
    redirect('/admin/giris');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Paneli</h1>
      <p>Hoş geldiniz, {session.user.name}!</p>
      <pre className="mt-4 p-4 bg-gray-100 rounded">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
} 