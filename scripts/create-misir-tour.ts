import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Kültür Turları kategorisini bul
  const category = await prisma.category.findFirst({
    where: {
      name: 'Kültür Turları'
    }
  });

  if (!category) {
    console.error('Kültür Turları kategorisi bulunamadı');
    return;
  }

  // Turu oluştur
  const tour = await prisma.tour.create({
    data: {
      title: "Mısır Ziyaretgahları Turu",
      description: "Mısır'daki önemli İslami ziyaretgahları kapsayan 6 günlük özel tur. Hz. Hüseyin, Hz. Zeynep, İmam Şafii ve diğer önemli ziyaretgahlar.",
      price: 2500,
      duration: 6,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-06'),
      capacity: 20,
      available: 20,
      isActive: true,
      categoryId: category.id,
      image: "/images/tours/misir-ziyaretgahlari.jpg",
      images: {
        create: [
          {
            url: "/images/tours/misir-ziyaretgahlari-1.jpg",
            title: "Hz. Hüseyin Camii",
            order: 1
          },
          {
            url: "/images/tours/misir-ziyaretgahlari-2.jpg",
            title: "El-Ezher Camii",
            order: 2
          },
          {
            url: "/images/tours/misir-ziyaretgahlari-3.jpg",
            title: "İmam Şafii Türbesi",
            order: 3
          }
        ]
      },
      itinerary: {
        create: [
          {
            day: 1,
            title: "Hz. Hüseyin Bölgesi",
            description: "Hz. Hüseyin, El-Ezher Camii, İbrahim Gülşeni, Ali al Bayyumi, Hasan al Kuveysini, İmam Şarani, Mustafa Sabri Efendi, Sultan Katibay ve Fatima al Nebevi ziyaretleri",
            activities: [
              "Hz. Hüseyin Ser-i Şerifi ziyareti",
              "El-Ezher Camii ziyareti",
              "İbrahim Gülşeni ziyareti",
              "Ali al Bayyumi ziyareti",
              "Hasan al Kuveysini ziyareti",
              "İmam Şarani ziyareti",
              "Mustafa Sabri Efendi ziyareti",
              "Sultan Katibay ziyareti",
              "Fatima al Nebevi ziyareti"
            ],
            meals: ["Kahvaltı", "Öğle Yemeği", "Akşam Yemeği"],
            accommodation: "Kahire'de 4 yıldızlı otel"
          },
          {
            day: 2,
            title: "Hz. Zeynep Bölgesi",
            description: "Hz. Zeynep, Hz. Ruqayya, Hz. Umm Kulthum, Hz. Nafisa, Hz. Sakina, Hz. Rabia al Adawiyya, Hz. Sayyida Aisha, Hz. Sayyida Zainab al Kubra ve Hz. Sayyida Fatima al Zahra ziyaretleri",
            activities: [
              "Hz. Zeynep Camii ziyareti",
              "Hz. Ruqayya ziyareti",
              "Hz. Umm Kulthum ziyareti",
              "Hz. Nafisa ziyareti",
              "Hz. Sakina ziyareti",
              "Hz. Rabia al Adawiyya ziyareti",
              "Hz. Sayyida Aisha ziyareti",
              "Hz. Sayyida Zainab al Kubra ziyareti",
              "Hz. Sayyida Fatima al Zahra ziyareti"
            ],
            meals: ["Kahvaltı", "Öğle Yemeği", "Akşam Yemeği"],
            accommodation: "Kahire'de 4 yıldızlı otel"
          },
          {
            day: 3,
            title: "İmam Şafii Bölgesi",
            description: "İmam Şafii, İmam Layth, İmam Abu Hanifa, İmam Malik, İmam Ahmad ibn Hanbal, İmam al Ghazali, İmam al Nawawi, İmam al Suyuti ve İmam al Qurtubi ziyaretleri",
            activities: [
              "İmam Şafii türbesi ziyareti",
              "İmam Layth ziyareti",
              "İmam Abu Hanifa ziyareti",
              "İmam Malik ziyareti",
              "İmam Ahmad ibn Hanbal ziyareti",
              "İmam al Ghazali ziyareti",
              "İmam al Nawawi ziyareti",
              "İmam al Suyuti ziyareti",
              "İmam al Qurtubi ziyareti"
            ],
            meals: ["Kahvaltı", "Öğle Yemeği", "Akşam Yemeği"],
            accommodation: "Kahire'de 4 yıldızlı otel"
          },
          {
            day: 4,
            title: "İskenderiye Ziyaretleri",
            description: "İskenderiye'deki önemli İslami ziyaretgahlar ve tarihi yerler",
            activities: [
              "İskenderiye'ye transfer",
              "Ebu'l Abbas el-Mursi Camii ziyareti",
              "İskenderiye Kütüphanesi ziyareti",
              "Kaitbay Kalesi ziyareti",
              "Montaza Sarayı ziyareti"
            ],
            meals: ["Kahvaltı", "Öğle Yemeği", "Akşam Yemeği"],
            accommodation: "İskenderiye'de 4 yıldızlı otel"
          },
          {
            day: 5,
            title: "Kahire Müzeleri",
            description: "Kahire'deki önemli müzeler ve tarihi yerler",
            activities: [
              "İskenderiye'den Kahire'ye dönüş",
              "İslam Sanatları Müzesi ziyareti",
              "Kahire Kalesi ziyareti",
              "Sultan Hassan Camii ziyareti",
              "Al-Rifai Camii ziyareti"
            ],
            meals: ["Kahvaltı", "Öğle Yemeği", "Akşam Yemeği"],
            accommodation: "Kahire'de 4 yıldızlı otel"
          },
          {
            day: 6,
            title: "Serbest Zaman ve Dönüş",
            description: "Serbest zaman ve İstanbul'a dönüş",
            activities: [
              "Serbest zaman",
              "Alışveriş imkanı",
              "İstanbul'a dönüş"
            ],
            meals: ["Kahvaltı"],
            accommodation: "Uçakta"
          }
        ]
      }
    },
    include: {
      category: true,
      itinerary: true
    }
  });

  console.log('Tur başarıyla oluşturuldu:', tour);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 