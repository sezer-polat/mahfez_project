import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[MOCK MAIL] To:', to);
    console.log('[MOCK MAIL] Subject:', subject);
    console.log('[MOCK MAIL] HTML:', html);
    return { messageId: 'mocked-dev-mail' };
  }
  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
} 