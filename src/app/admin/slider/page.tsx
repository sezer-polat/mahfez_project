"use client";

import React, { useEffect, useRef, useState } from 'react';

interface SliderImage {
  id: string;
  url: string;
  publicId: string;
  createdAt: string;
}

export default function SliderPage() {
  const [images, setImages] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const updateInputRef = useRef<HTMLInputElement>(null);

  // Slider görsellerini getir
  const fetchImages = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/slider');
    const data = await res.json();
    setImages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Görsel yükle
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/slider', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      fetchImages();
    } else {
      alert('Yükleme başarısız!');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Görsel sil
  const handleDelete = async (id: string) => {
    if (!confirm('Bu görseli silmek istediğinize emin misiniz?')) return;
    setLoading(true);
    const res = await fetch(`/api/admin/slider?id=${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setImages(images.filter((img) => img.id !== id));
    } else {
      alert('Silme başarısız!');
    }
    setLoading(false);
  };

  // Slider görselini güncelle
  const handleUpdate = (id: string) => {
    setEditingId(id);
    if (updateInputRef.current) {
      updateInputRef.current.value = '';
      updateInputRef.current.click();
    }
  };

  const handleUpdateFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingId) return;
    const file = e.target.files?.[0];
    if (!file) {
      setEditingId(null);
      return;
    }
    setUpdating(true);
    const formData = new FormData();
    formData.append('file', file);
    // İstersen title/description da ekleyebilirsin
    const res = await fetch(`/api/admin/slider?id=${editingId}`, {
      method: 'PUT',
      body: formData,
    });
    if (res.ok) {
      fetchImages();
    } else {
      alert('Güncelleme başarısız!');
    }
    setUpdating(false);
    setEditingId(null);
    if (updateInputRef.current) updateInputRef.current.value = '';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Slider Yönetimi</h1>
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleUpload}
          className="mb-2"
          disabled={uploading}
        />
        {uploading && <span className="ml-2 text-primary">Yükleniyor...</span>}
      </div>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group border rounded-lg overflow-hidden">
              <img src={img.url} alt="Slider" className="w-full h-40 object-cover" />
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                title="Sil"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
              <button
                onClick={() => handleUpdate(img.id)}
                className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                title="Güncelle"
                disabled={updating}
              >
                <i className="ri-edit-2-line"></i>
              </button>
            </div>
          ))}
          {/* Gizli input, güncelleme için */}
          <input
            type="file"
            accept="image/*"
            ref={updateInputRef}
            onChange={handleUpdateFile}
            className="hidden"
            disabled={updating}
          />
        </div>
      )}
      {images.length === 0 && !loading && (
        <div className="text-gray-500 mt-8">Henüz slider görseli eklenmemiş.</div>
      )}
    </div>
  );
} 





