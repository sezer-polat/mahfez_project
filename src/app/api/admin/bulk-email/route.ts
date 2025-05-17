import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { subject, content, filters } = await req.json()

    // Filtrelere göre kullanıcıları bul
    let whereClause = {}
    if (filters) {
      if (filters.role) {
        whereClause = {
          ...whereClause,
          role: filters.role
        }
      }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        email: true,
        name: true
      }
    })

    // E-postaları gönder
    const emailPromises = users.map(user => 
      transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: subject,
        html: content.replace('{{name}}', user.name || 'Değerli Müşterimiz')
      })
    )

    await Promise.all(emailPromises)

    return NextResponse.json({
      success: true,
      message: `${users.length} kullanıcıya e-posta gönderildi`
    })
  } catch (error) {
    console.error('Bulk email error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 