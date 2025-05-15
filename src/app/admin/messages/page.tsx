'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '../Sidebar';
import { toast } from 'react-hot-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/giris');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/admin/messages');
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Mesajlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'ADMIN') {
      fetchMessages();
    }
  }, [session]);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, isRead: true } : msg
        ));
        toast.success('Mesaj okundu olarak işaretlendi');
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Bir hata oluştu');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
        setSelectedMessage(null);
        toast.success('Mesaj silindi');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Bir hata oluştu');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 pl-[150px]">
          <div className="max-w-[1800px] mx-auto px-8 py-8">
            <h1 className="text-2xl font-bold mb-8">İletişim Mesajları</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mesaj Listesi */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow-md">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Mesajlar</h2>
                </div>
                <div className="divide-y">
                  {messages.length === 0 ? (
                    <p className="p-4 text-gray-500 text-center">Henüz mesaj bulunmuyor</p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          selectedMessage?.id === message.id ? 'bg-gray-50' : ''
                        } ${!message.isRead ? 'font-semibold' : ''}`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-600">{message.name}</p>
                            <p className="text-sm text-gray-500">{message.subject}</p>
                          </div>
                          {!message.isRead && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
                              Yeni
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(message.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Mesaj Detayı */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
                {selectedMessage ? (
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">{selectedMessage.subject}</h2>
                        <p className="text-sm text-gray-600">
                          {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                        </p>
                        {selectedMessage.phone && (
                          <p className="text-sm text-gray-600">Tel: {selectedMessage.phone}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {!selectedMessage.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(selectedMessage.id)}
                            className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark"
                          >
                            Okundu İşaretle
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMessage(selectedMessage.id)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                    <p className="text-sm text-gray-400 mt-4">
                      Gönderilme Tarihi: {new Date(selectedMessage.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    Mesaj seçilmedi
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
} 