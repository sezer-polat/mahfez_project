'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  const stats = [
    { label: 'Mutlu Müşteri', value: '3,000+' },
    { label: 'Tamamlanan Tur', value: '150+' },
    { label: 'Yıllık Deneyim', value: '3+' },
    { label: 'Profesyonel Rehber', value: '15+' },
  ]

  const team = [
    {
      name: 'Devran Tulgar',
      role: 'Müdür',
      image: '/team/ceo.jpg',
      bio: 'Şirketimizin yönetiminden sorumlu, deneyimli liderimiz.',
    },
    {
      name: 'Emre Örnek',
      role: 'Tur Görevlisi',
      image: '/team/operations.jpg',
      bio: 'Turlarımızın başarılı bir şekilde gerçekleşmesi için çalışan profesyonel ekibimiz.',
    },
    {
      name: 'Adem Tulgar',
      role: 'Sosyal Medya Sorumlusu',
      image: '/team/sales.jpg',
      bio: 'Sosyal medya hesaplarımızın yönetimi ve dijital iletişim stratejilerimizden sorumlu.',
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-primary">
        <div className="absolute inset-0">
          <Image
            src="/about/hero.jpg"
            alt="Yeşil Yolculuk Ekibi"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Hakkımızda
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            2022 yılında kurulan Mahfez Tur, kısa sürede sektörde güvenilir ve kaliteli hizmet anlayışıyla öne çıkmayı başardı. 
            Müşteri memnuniyeti odaklı yaklaşımımız ve profesyonel ekibimizle, unutulmaz seyahat deneyimleri sunmaya devam ediyoruz.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="text-3xl font-extrabold text-primary">{stat.value}</dt>
                <dd className="mt-2 text-base text-gray-600">{stat.label}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
              <p className="text-gray-600">
                Müşterilerimize unutulmaz seyahat deneyimleri sunarak, Türkiye'nin doğal ve
                kültürel zenginliklerini keşfetmelerini sağlamak. Sürdürülebilir turizm
                anlayışıyla, çevreye ve yerel kültüre saygılı bir yaklaşım benimseyerek,
                sektörde örnek teşkil etmek.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h2>
              <p className="text-gray-600">
                Türkiye'nin lider tur operatörü olmak ve global ölçekte tanınan, güvenilir
                bir marka haline gelmek. Yenilikçi yaklaşımlarımız ve kaliteli hizmet
                anlayışımızla, seyahat sektöründe fark yaratmak.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Ekibimiz
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Deneyimli ve profesyonel ekibimizle hizmetinizdeyiz
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                  <p className="mt-2 text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Değerlerimiz
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              İşimizi yaparken bizi yönlendiren temel değerlerimiz
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-primary text-4xl mb-4">
                <i className="ri-heart-line"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Müşteri Odaklılık</h3>
              <p className="text-gray-600">
                Müşterilerimizin memnuniyeti ve mutluluğu her zaman önceliğimizdir.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-primary text-4xl mb-4">
                <i className="ri-leaf-line"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Sürdürülebilirlik</h3>
              <p className="text-gray-600">
                Çevreye ve topluma karşı sorumluluk bilinciyle hareket ederiz.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-primary text-4xl mb-4">
                <i className="ri-star-line"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Kalite</h3>
              <p className="text-gray-600">
                En yüksek standartlarda hizmet sunmayı taahhüt ederiz.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Seyahat Etmeye Hazır mısınız?</span>
            <span className="block text-primary-light">
              Hemen bir tur seçin ve unutulmaz bir deneyim yaşayın.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/tours"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
              >
                Turları Keşfet
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-dark hover:bg-opacity-90"
              >
                Bize Ulaşın
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 