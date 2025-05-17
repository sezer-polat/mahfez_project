import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Session yoksa veya kullanıcı admin değilse giriş sayfasına yönlendir
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    redirect('/admin/giris');
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Paneli</h1>
      <p className="mb-4">Hoş geldiniz, {session.user.name}!</p>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Kullanıcı Bilgileri</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Ad Soyad:</span> {session.user.name}</p>
          <p><span className="font-medium">Email:</span> {session.user.email}</p>
          <p><span className="font-medium">Rol:</span> {session.user.role}</p>
        </div>
      </div>
    </div>
  );
} 