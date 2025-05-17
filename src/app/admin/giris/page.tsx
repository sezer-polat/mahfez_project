'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status, update } = useSession();

  // Eğer zaten giriş yapılmış ve adminse, otomatik yönlendir
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      router.replace('/admin');
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Session'ı güncelle ve admin rolünü kontrol et
      const updated = await update();
      if (updated?.user?.role !== 'ADMIN') {
        setError('Bu sayfaya erişim yetkiniz yok.');
        setLoading(false);
        return;
      }

      router.replace('/admin');
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div>Yükleniyor...</div>;
  }

  // Eğer zaten giriş yapılmış ve adminse, formu gösterme
  if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
} 