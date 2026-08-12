import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
});

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (env.NODE_ENV === 'development' && !env.SMTP_USER) {
    console.log(`[Email] To: ${to}, Subject: ${subject}`);
    return;
  }
  await transporter.sendMail({ from: env.SMTP_FROM, to, subject, html });
}
