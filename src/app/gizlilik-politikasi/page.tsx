'use client'

import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Gizlilik Politikası
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>

        <div className="mt-12 prose prose-lg prose-primary mx-auto">
          <h2>1. Veri Toplama</h2>
          <p>
            Yeşil Yolculuk olarak, hizmetlerimizi sunabilmek için aşağıdaki kişisel verileri
            toplamaktayız:
          </p>
          <ul>
            <li>Ad ve soyad</li>
            <li>E-posta adresi</li>
            <li>Telefon numarası</li>
            <li>Adres bilgileri</li>
            <li>Ödeme bilgileri</li>
            <li>Rezervasyon geçmişi</li>
          </ul>

          <h2>2. Veri Kullanımı</h2>
          <p>
            Topladığımız verileri aşağıdaki amaçlar için kullanmaktayız:
          </p>
          <ul>
            <li>Rezervasyon işlemlerinin gerçekleştirilmesi</li>
            <li>Müşteri hizmetleri desteği</li>
            <li>Hizmet kalitesinin iyileştirilmesi</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Güvenlik ve dolandırıcılık önleme</li>
          </ul>

          <h2>3. Veri Güvenliği</h2>
          <p>
            Verilerinizin güvenliği için aşağıdaki önlemleri almaktayız:
          </p>
          <ul>
            <li>SSL şifreleme</li>
            <li>Güvenli ödeme sistemleri</li>
            <li>Düzenli güvenlik güncellemeleri</li>
            <li>Erişim kontrolü ve yetkilendirme</li>
            <li>Veri yedekleme ve kurtarma sistemleri</li>
          </ul>

          <h2>4. Veri Paylaşımı</h2>
          <p>
            Kişisel verileriniz, aşağıdaki durumlar dışında üçüncü taraflarla paylaşılmaz:
          </p>
          <ul>
            <li>Yasal zorunluluk durumunda</li>
            <li>Hizmet sağlayıcılarımızla (örn. ödeme sistemleri)</li>
            <li>İzniniz olması durumunda</li>
            <li>Şirket birleşme veya satın almalarında</li>
          </ul>

          <h2>5. Çerezler</h2>
          <p>
            Web sitemizde aşağıdaki çerez türlerini kullanmaktayız:
          </p>
          <ul>
            <li>Zorunlu çerezler (site işlevselliği için)</li>
            <li>Analitik çerezler (kullanım istatistikleri için)</li>
            <li>Tercih çerezleri (kullanıcı ayarları için)</li>
            <li>Pazarlama çerezleri (reklam ve tanıtım için)</li>
          </ul>

          <h2>6. Kullanıcı Hakları</h2>
          <p>
            KVKK kapsamında aşağıdaki haklara sahipsiniz:
          </p>
          <ul>
            <li>Verilerinize erişim hakkı</li>
            <li>Verilerinizin düzeltilmesini talep etme hakkı</li>
            <li>Verilerinizin silinmesini talep etme hakkı</li>
            <li>Veri işlemeye itiraz etme hakkı</li>
            <li>Veri taşınabilirliği hakkı</li>
          </ul>

          <h2>7. Veri Saklama</h2>
          <p>
            Kişisel verileriniz, yasal yükümlülüklerimiz ve hizmet gereksinimlerimiz
            kapsamında saklanmaktadır. Verileriniz, artık gerekli olmadığında güvenli bir
            şekilde silinir veya anonimleştirilir.
          </p>

          <h2>8. Değişiklikler</h2>
          <p>
            Bu gizlilik politikasını önceden haber vermeksizin değiştirme hakkını saklı
            tutarız. Değişiklikler sitede yayınlandığı anda yürürlüğe girer.
          </p>

          <h2>9. İletişim</h2>
          <p>
            Gizlilik politikamız hakkında sorularınız için{' '}
            <Link href="/iletisim" className="text-primary hover:text-opacity-90">
              iletişim sayfamızdan
            </Link>{' '}
            bize ulaşabilirsiniz.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/kayit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-opacity-90"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Kayıt Sayfasına Dön
          </Link>
        </div>
      </div>
    </div>
  )
} 