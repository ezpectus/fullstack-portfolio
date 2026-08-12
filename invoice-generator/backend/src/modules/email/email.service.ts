import nodemailer from 'nodemailer';
import { env } from '../../config/env';
import { prisma } from '../../config/db';
import { NotFoundError, BadRequestError } from '../../shared/errors';

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: env.smtp.host,
        port: env.smtp.port,
        secure: env.smtp.port === 465,
        auth: { user: env.smtp.user, pass: env.smtp.pass },
      });
    }
    return this.transporter;
  }

  async sendInvoice(userId: string, invoiceId: string) {
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, userId },
      include: { client: true, items: true },
    });
    if (!invoice) throw new NotFoundError('Invoice');
    if (!invoice.client.email) throw new BadRequestError('Client has no email address');

    const company = await prisma.company.findUnique({ where: { userId } });
    const subject = company?.emailSubject || `Invoice ${invoice.number} from ${company?.name || 'us'}`;
    const body = company?.emailBody || `Please find your invoice ${invoice.number} attached. Total: ${invoice.currency} ${invoice.total}`;

    const transporter = this.getTransporter();
    await transporter.sendMail({
      from: env.smtp.from || company?.email || 'noreply@example.com',
      to: invoice.client.email,
      subject,
      text: body,
      html: `<p>${body.replace(/\n/g, '<br>')}</p>`,
    });

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'SENT', sentAt: new Date() },
    });

    return { message: 'Invoice sent successfully' };
  }
}

export const emailService = new EmailService();
