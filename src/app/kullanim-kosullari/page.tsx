'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Kullanım Koşulları
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>

        <div className="mt-12 prose prose-lg prose-primary mx-auto">
          <h2>1. Genel Hükümler</h2>
          <p>
            Yeşil Yolculuk web sitesini kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız.
            Bu koşulları kabul etmiyorsanız, lütfen sitemizi kullanmayınız.
          </p>

          <h2>2. Hizmet Kullanımı</h2>
          <p>
            Yeşil Yolculuk, kullanıcılarına tur ve seyahat hizmetleri sunmaktadır. Bu hizmetlerin
            kullanımı sırasında aşağıdaki kurallara uyulması gerekmektedir:
          </p>
          <ul>
            <li>Doğru ve güncel bilgilerin sağlanması</li>
            <li>Hesap güvenliğinin sağlanması</li>
            <li>Diğer kullanıcıların haklarına saygı gösterilmesi</li>
            <li>Yasal düzenlemelere uyulması</li>
          </ul>

          <h2>3. Rezervasyon ve İptal Koşulları</h2>
          <p>
            Tur rezervasyonları aşağıdaki koşullara tabidir:
          </p>
          <ul>
            <li>Rezervasyonlar en az 24 saat önceden yapılmalıdır</li>
            <li>İptal işlemleri tur başlangıcından 48 saat öncesine kadar ücretsizdir</li>
            <li>48 saatten kısa sürede yapılan iptallerde ücret iadesi yapılmaz</li>
            <li>Mücbir sebepler durumunda farklı koşullar uygulanabilir</li>
          </ul>

          <h2>4. Ödeme Koşulları</h2>
          <p>
            Ödemeler aşağıdaki koşullara tabidir:
          </p>
          <ul>
            <li>Tüm ödemeler USD (Amerikan Doları) cinsinden yapılır</li>
            <li>Kredi kartı ile ödemelerde 3D Secure kullanılır</li>
            <li>Havale/EFT ile ödemelerde banka dekontu talep edilir</li>
            <li>Ödeme onayı sonrası rezervasyon kesinleşir</li>
          </ul>

          <h2>5. Gizlilik ve Veri Güvenliği</h2>
          <p>
            Kullanıcı verilerinin güvenliği ve gizliliği bizim için önemlidir. Detaylı bilgi için{' '}
            <Link href="/gizlilik-politikasi" className="text-primary hover:text-opacity-90">
              gizlilik politikamızı
            </Link>{' '}
            inceleyebilirsiniz.
          </p>

          <h2>6. Sorumluluk Sınırları</h2>
          <p>
            Yeşil Yolculuk, aşağıdaki durumlarda sorumluluk kabul etmez:
          </p>
          <ul>
            <li>Mücbir sebeplerden kaynaklanan hizmet kesintileri</li>
            <li>Kullanıcı hatalarından kaynaklanan sorunlar</li>
            <li>Üçüncü taraf hizmetlerinden kaynaklanan aksaklıklar</li>
            <li>Doğal afetler ve olağanüstü durumlar</li>
          </ul>

          <h2>7. Fikri Mülkiyet Hakları</h2>
          <p>
            Sitede yer alan tüm içerikler (metin, görsel, logo vb.) Yeşil Yolculuk'un fikri
            mülkiyetidir ve izinsiz kullanılamaz.
          </p>

          <h2>8. Değişiklikler</h2>
          <p>
            Yeşil Yolculuk, bu kullanım koşullarını önceden haber vermeksizin değiştirme hakkını
            saklı tutar. Değişiklikler sitede yayınlandığı anda yürürlüğe girer.
          </p>

          <h2>9. İletişim</h2>
          <p>
            Kullanım koşulları ile ilgili sorularınız için{' '}
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