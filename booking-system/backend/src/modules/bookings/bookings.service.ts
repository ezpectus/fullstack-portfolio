import { bookingsRepository } from './bookings.repository';
import { prisma } from '../../config/db';
import { redis } from '../../config/redis';
import { NotFoundError, ConflictError, BadRequestError, ForbiddenError } from '../../shared/errors';
import { parsePagination, buildPaginationMeta, generateBookingNumber } from '../../shared/utils';
import { VALID_BOOKING_TRANSITIONS, ROLES } from '../../shared/constants';
import type { RequestQuery, AuthPayload } from '../../shared/types';
import type { CreateBookingInput } from './bookings.dto';
import crypto from 'crypto';

const LOCK_TTL = 10;

async function getProviderIdForUser(userId: string): Promise<string | null> {
  const provider = await prisma.provider.findUnique({ where: { userId } });
  return provider?.id ?? null;
}

export class BookingsService {
  async list(query: RequestQuery, user: AuthPayload) {
    const { page, limit, skip } = parsePagination(query);
    if (user.role === ROLES.PROVIDER) {
      const providerId = await getProviderIdForUser(user.userId);
      if (providerId) query.providerId = providerId;
    }
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;
    const { bookings, total } = await bookingsRepository.findMany({
      skip, limit, status: query.status, providerId: query.providerId, serviceId: query.serviceId,
      customerId: query.customerId, startDate, endDate, search: query.search,
      sortBy: query.sortBy, sortOrder: query.sortOrder,
    });
    return { data: bookings, pagination: buildPaginationMeta(total, page, limit) };
  }

  async getById(id: string, user: AuthPayload) {
    const booking = await bookingsRepository.findById(id);
    if (!booking) throw new NotFoundError('Booking');
    if (user.role === ROLES.PROVIDER) {
      const providerId = await getProviderIdForUser(user.userId);
      if (!providerId || booking.providerId !== providerId) {
        throw new ForbiddenError('You do not have access to this booking');
      }
    }
    return booking;
  }

  async create(input: CreateBookingInput, user: AuthPayload) {
    if (user.role === ROLES.PROVIDER) {
      const providerId = await getProviderIdForUser(user.userId);
      if (!providerId || input.providerId !== providerId) {
        throw new ForbiddenError('You can only create bookings for your own provider profile');
      }
    }

    const service = await prisma.service.findUnique({ where: { id: input.serviceId } });
    if (!service) throw new NotFoundError('Service');
    if (!service.isActive) throw new BadRequestError('Service is not active');

    const provider = await prisma.provider.findUnique({ where: { id: input.providerId } });
    if (!provider) throw new NotFoundError('Provider');
    if (!provider.isActive) throw new BadRequestError('Provider is not active');

    const customer = await prisma.customer.findUnique({ where: { id: input.customerId } });
    if (!customer) throw new NotFoundError('Customer');

    const startTime = new Date(input.startTime);
    const endTime = new Date(startTime.getTime() + service.duration * 60 * 1000);

    if (startTime < new Date()) throw new BadRequestError('Cannot book in the past');

    const lockKey = `booking:lock:${input.providerId}:${startTime.toISOString()}`;
    const lockToken = crypto.randomUUID();

    const acquired = await redis.set(lockKey, lockToken, 'EX', LOCK_TTL, 'NX');
    if (!acquired) throw new ConflictError('This slot is being booked by someone else, please try again');

    try {
      const hasConflict = await bookingsRepository.checkConflict(input.providerId, startTime, endTime);
      if (hasConflict) throw new ConflictError('This time slot is already booked');

      const booking = await prisma.$transaction(async (tx) => {
        const created = await tx.booking.create({
          data: {
            bookingNumber: generateBookingNumber(),
            serviceId: input.serviceId,
            providerId: input.providerId,
            customerId: input.customerId,
            startTime,
            endTime,
            price: service.price,
            notes: input.notes,
          },
          include: { service: true, provider: { include: { user: { select: { name: true } } } }, customer: true },
        });

        await tx.notification.create({
          data: { bookingId: created.id, type: 'CONFIRMATION', status: 'PENDING' },
        });

        return created;
      });

      return booking;
    } finally {
      const script = `if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end`;
      await redis.eval(script, 1, lockKey, lockToken);
    }
  }

  async updateStatus(id: string, status: string, user: AuthPayload, cancelReason?: string) {
    const booking = await bookingsRepository.findById(id);
    if (!booking) throw new NotFoundError('Booking');
    if (user.role === ROLES.PROVIDER) {
      const providerId = await getProviderIdForUser(user.userId);
      if (!providerId || booking.providerId !== providerId) {
        throw new ForbiddenError('You do not have access to this booking');
      }
    }

    const allowed = VALID_BOOKING_TRANSITIONS[booking.status] || [];
    if (!allowed.includes(status)) {
      throw new BadRequestError(`Cannot transition from ${booking.status} to ${status}`);
    }

    const updated = await bookingsRepository.updateStatus(id, status, cancelReason);

    if (status === 'CANCELLED') {
      await prisma.notification.create({
        data: { bookingId: id, type: 'CANCELLATION', status: 'PENDING' },
      });
    }

    return updated;
  }

  async delete(id: string, user: AuthPayload) {
    const booking = await bookingsRepository.findById(id);
    if (!booking) throw new NotFoundError('Booking');
    if (user.role === ROLES.PROVIDER) {
      const providerId = await getProviderIdForUser(user.userId);
      if (!providerId || booking.providerId !== providerId) {
        throw new ForbiddenError('You do not have access to this booking');
      }
    }
    return bookingsRepository.delete(id);
  }
}

export const bookingsService = new BookingsService();
