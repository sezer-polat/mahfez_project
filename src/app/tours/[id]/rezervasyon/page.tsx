"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ReservationPage() {
  const router = useRouter();
  const { id: tourId } = useParams();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    specialRequests: "",
    numberOfPeople: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tourId }),
      });
      if (res.ok) {
        toast.success("Rezervasyonunuz başarıyla oluşturuldu!");
        router.push("/profilim?tab=rezervasyonlar");
      } else {
        const data = await res.json();
        toast.error(data.error || "Bir hata oluştu");
      }
    } catch (err) {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Rezervasyon Yap</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Ad</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Soyad</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} required className="input" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">E-posta</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium">Telefon</label>
          <input name="phone" value={form.phone} onChange={handleChange} required className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium">Adres</label>
          <input name="address" value={form.address} onChange={handleChange} required className="input" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Şehir</label>
            <input name="city" value={form.city} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Ülke</label>
            <input name="country" value={form.country} onChange={handleChange} required className="input" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Kişi Sayısı</label>
          <input name="numberOfPeople" type="number" min={1} value={form.numberOfPeople} onChange={handleChange} required className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium">Özel İstekler</label>
          <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange} className="input" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition">
          {loading ? "Gönderiliyor..." : "Rezervasyon Yap"}
        </button>
      </form>
    </div>
  );
} 