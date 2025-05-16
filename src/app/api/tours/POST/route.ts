import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { corsHeaders } from '@/lib/cors';

export const dynamic = 'force-dynamic';

// POST: Yeni tur oluştur
export default async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Kültür Turları kategorisini bul
    const category = await prisma.category.findFirst({
      where: {
        name: 'Kültür Turları'
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Kültür Turları kategorisi bulunamadı' },
        { status: 404 }
      );
    }

    const tour = await prisma.tour.create({
      data: {
        ...data,
        categoryId: category.id,
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
              meals: ["Kahvaltı", "Öğle Yemeği", "Akşam Yemeği"]
            },
            {
              day: 2,
              title: "İmam Şafi Bölgesi",
              description: "İmam Şafii, İmam Şasi ibn Saad, Hafız Hacer Askalani, Ukbe ibni Amır, Rabiatul Adevi, Muhammad el Hanefi, Zanüni Misri ve Zakariya al Ensari ziyaretleri",
              activities: [
                "İmam Şafii ziyareti",
                "İmam Şasi ibn Saad ziyareti",
                "Hafız Hacer Askalani ziyareti",
                "Ukbe ibni Amır ziyareti",
                "Rabiatul Adevi ziyareti",
                "Muhammad el Hanefi ziyareti",
                "Zanüni Misri ziyareti",
                "Zakariya al Ensari ziyareti"
              ],
              meals: ["Kahvaltı", "Öğle Yemeği", "Akşam Yemeği"]
            },
            {
              day: 3,
              title: "İmam Şafii Bölgesi",
              description: "Hz. Amır ibni As, Ataaullah essekanderi, Zahidul kevseri, Abdullah ibni eni Cemre, İmam Suyuti, İsa ibn Abdülkadir Ceylani ve Fatima al Aina ziyaretleri",
              activities: [
                "Hz. Amır ibni As ziyareti",
                "Ataaullah essekanderi ziyareti",
                "Zahidul kevseri ziyareti",
                "Abdullah ibni eni Cemre ziyareti",
                "İmam Suyuti ziyareti",
                "İsa ibn Abdülkadir Ceylani ziyareti",
                "Fatima al Aina ziyareti"
              ],
              meals: ["Kahvaltı", "Öğle Yemeği", "Akşam Yemeği"]
            },
            {
              day: 4,
              title: "Piramitler ve Müze Turu",
              description: "Giza Piramitleri, Müze ziyareti ve Nil Nehri'nde tekne turu",
              activities: [
                "Giza Piramitleri ziyareti",
                "Müze ziyareti",
                "Nil Nehri'nde tekne turu"
              ],
              meals: ["Kahvaltı", "Öğle Yemeği", "Akşam Yemeği"]
            },
            {
              day: 5,
              title: "İskenderiye Bölgesi",
              description: "Ahmed Bedevi Hz, Seyyid İbrahim Dusuki Hz, İmam Busayri, İmam Mursi al Abbas ve Şeyh Yakuti Arşi ziyaretleri",
              activities: [
                "Ahmed Bedevi Hz ziyareti",
                "Seyyid İbrahim Dusuki Hz ziyareti",
                "İmam Busayri ziyareti",
                "İmam Mursi al Abbas ziyareti",
                "Şeyh Yakuti Arşi ziyareti"
              ],
              meals: ["Kahvaltı", "Öğle Yemeği", "Akşam Yemeği"]
            },
            {
              day: 6,
              title: "Seyyideler Bölgesi",
              description: "Hz. Zeynep, Hz. Nefise, Hz. Sakine, Hz. Atika, Hz. Ayşe bint Cafer, Ebu Şubbak el Rafii, Muhammed eni Enver, Ali Paşa Camii ve İbn Tolun Camii ziyaretleri",
              activities: [
                "Hz. Zeynep ziyareti",
                "Hz. Nefise ziyareti",
                "Hz. Sakine ziyareti",
                "Hz. Atika ziyareti",
                "Hz. Ayşe bint Cafer ziyareti",
                "Ebu Şubbak el Rafii ziyareti",
                "Muhammed eni Enver ziyareti",
                "Ali Paşa Camii ziyareti",
                "İbn Tolun Camii ziyareti"
              ],
              meals: ["Kahvaltı", "Öğle Yemeği", "Akşam Yemeği"]
            }
          ]
        }
      },
      include: {
        category: true,
        itinerary: true
      }
    });

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 