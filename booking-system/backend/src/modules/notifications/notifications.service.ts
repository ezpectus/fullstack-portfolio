import { notificationsRepository } from './notifications.repository';
import { prisma } from '../../config/db';
import { env } from '../../config/env';
import { NotFoundError } from '../../shared/errors';
import { parsePagination, buildPaginationMeta } from '../../shared/utils';
import type { RequestQuery } from '../../shared/types';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
});

export class NotificationsService {
  async list(query: RequestQuery) {
    const { page, limit, skip } = parsePagination(query);
    const { notifications, total } = await notificationsRepository.findMany({ skip, limit, status: query.status, sortBy: query.sortBy, sortOrder: query.sortOrder });
    return { data: notifications, pagination: buildPaginationMeta(total, page, limit) };
  }

  async send(bookingId: string, type: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { service: true, provider: { include: { user: true } }, customer: true } });
    if (!booking) throw new NotFoundError('Booking');

    const notification = await notificationsRepository.create({ bookingId, type });

    try {
      const subjectMap: Record<string, string> = {
        CONFIRMATION: `Booking Confirmed: ${booking.bookingNumber}`,
        REMINDER: `Reminder: Upcoming booking ${booking.bookingNumber}`,
        CANCELLATION: `Booking Cancelled: ${booking.bookingNumber}`,
      };

      await transporter.sendMail({
        from: env.smtp.user || 'noreply@bookingsystem.com',
        to: booking.customer.email,
        subject: subjectMap[type] || 'Booking Notification',
        html: `
          <h2>${subjectMap[type] || 'Booking Notification'}</h2>
          <p>Booking Number: ${booking.bookingNumber}</p>
          <p>Service: ${booking.service.name}</p>
          <p>Provider: ${booking.provider.user.name}</p>
          <p>Date: ${booking.startTime.toISOString()}</p>
          <p>Customer: ${booking.customer.name}</p>
        `,
      });

      await notificationsRepository.updateStatus(notification.id, 'SENT');
      return { message: 'Notification sent' };
    } catch (error) {
      await notificationsRepository.updateStatus(notification.id, 'FAILED');
      throw error;
    }
  }
}

export const notificationsService = new NotificationsService();
