import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const reportType = searchParams.get('type');
    const format = searchParams.get('format');

    if (!startDate || !endDate || !reportType || !format) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    let data;
    switch (reportType) {
      case 'reservations':
        data = await prisma.reservation.findMany({
          where: {
            createdAt: {
              gte: start,
              lte: end
            }
          },
          include: {
            tour: true
          }
        });
        break;
      case 'tours':
        data = await prisma.tour.findMany({
          where: {
            createdAt: {
              gte: start,
              lte: end
            }
          },
          include: {
            category: true,
            reservations: true
          }
        });
        break;
      case 'financial':
        data = await prisma.reservation.findMany({
          where: {
            status: 'CONFIRMED',
            createdAt: {
              gte: start,
              lte: end
            }
          },
          include: {
            tour: true
          }
        });
        break;
      default:
        return new NextResponse('Invalid report type', { status: 400 });
    }

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');

      // Excel başlıklarını ve verilerini ayarla
      switch (reportType) {
        case 'reservations':
          worksheet.columns = [
            { header: 'Rezervasyon ID', key: 'id' },
            { header: 'Tur ID', key: 'tourId' },
            { header: 'Ad Soyad', key: 'name' },
            { header: 'Durum', key: 'status' },
            { header: 'Toplam Tutar', key: 'amount' },
            { header: 'Tarih', key: 'date' }
          ];
          worksheet.addRows(data.map((reservation: any) => ({
            id: reservation.id,
            tourId: reservation.tourId,
            name: reservation.firstName + ' ' + reservation.lastName,
            status: reservation.status,
            amount: reservation.totalPrice,
            date: new Date(reservation.createdAt).toLocaleDateString('tr-TR')
          })));
          break;
        case 'tours':
          worksheet.columns = [
            { header: 'Tur ID', key: 'id' },
            { header: 'Başlık', key: 'title' },
            { header: 'Kategori ID', key: 'categoryId' },
            { header: 'Fiyat', key: 'price' },
            { header: 'Oluşturulma Tarihi', key: 'date' }
          ];
          worksheet.addRows(data.map((tour: any) => ({
            id: tour.id,
            title: tour.title,
            categoryId: tour.categoryId,
            price: tour.price,
            date: new Date(tour.createdAt).toLocaleDateString('tr-TR')
          })));
          break;
        case 'financial':
          worksheet.columns = [
            { header: 'Tarih', key: 'date' },
            { header: 'Tur ID', key: 'tourId' },
            { header: 'Tutar', key: 'amount' }
          ];
          worksheet.addRows(data.map((reservation: any) => ({
            date: new Date(reservation.createdAt).toLocaleDateString('tr-TR'),
            tourId: reservation.tourId,
            amount: reservation.totalPrice
          })));
          break;
      }

      const buffer = await workbook.xlsx.writeBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename=${reportType}-report-${new Date().toISOString()}.xlsx`
        }
      });
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {});

      // PDF başlığını ayarla
      doc.fontSize(20).text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Raporu`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Tarih Aralığı: ${start.toLocaleDateString('tr-TR')} - ${end.toLocaleDateString('tr-TR')}`);
      doc.moveDown();

      // PDF içeriğini oluştur
      switch (reportType) {
        case 'reservations':
          data.forEach((reservation: any) => {
            doc.fontSize(12).text(`Rezervasyon ID: ${reservation.id}`);
            doc.fontSize(10).text(`Tur ID: ${reservation.tourId}`);
            doc.text(`Ad Soyad: ${reservation.firstName} ${reservation.lastName}`);
            doc.text(`Durum: ${reservation.status}`);
            doc.text(`Toplam Tutar: ₺${reservation.totalPrice}`);
            doc.text(`Tarih: ${new Date(reservation.createdAt).toLocaleDateString('tr-TR')}`);
            doc.moveDown();
          });
          break;
        case 'tours':
          data.forEach((tour: any) => {
            doc.fontSize(12).text(`Tur ID: ${tour.id}`);
            doc.fontSize(10).text(`Başlık: ${tour.title}`);
            doc.text(`Kategori ID: ${tour.categoryId}`);
            doc.text(`Fiyat: ₺${tour.price}`);
            doc.text(`Oluşturulma Tarihi: ${new Date(tour.createdAt).toLocaleDateString('tr-TR')}`);
            doc.moveDown();
          });
          break;
        case 'financial':
          data.forEach((reservation: any) => {
            doc.fontSize(12).text(`Tarih: ${new Date(reservation.createdAt).toLocaleDateString('tr-TR')}`);
            doc.fontSize(10).text(`Tur ID: ${reservation.tourId}`);
            doc.text(`Tutar: ₺${reservation.totalPrice}`);
            doc.moveDown();
          });
          break;
      }

      doc.end();

      const buffer = Buffer.concat(chunks);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=${reportType}-report-${new Date().toISOString()}.pdf`
        }
      });
    }

    return new NextResponse('Invalid format', { status: 400 });
  } catch (error) {
    console.error('Report generation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 