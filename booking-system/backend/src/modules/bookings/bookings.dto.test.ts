import { describe, it, expect } from 'vitest';
import { createBookingSchema, updateBookingStatusSchema, paginationSchema } from './bookings.dto';

describe('bookings.dto', () => {
  describe('createBookingSchema', () => {
    const valid = {
      serviceId: 'svc-1',
      providerId: 'prov-1',
      customerId: 'cust-1',
      startTime: '2024-12-01T10:00:00Z',
    };

    it('validates a correct booking', () => {
      const result = createBookingSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('accepts optional notes', () => {
      const result = createBookingSchema.safeParse({ ...valid, notes: 'First appointment' });
      expect(result.success).toBe(true);
    });

    it('rejects missing serviceId', () => {
      const result = createBookingSchema.safeParse({ ...valid, serviceId: '' });
      expect(result.success).toBe(false);
    });

    it('rejects missing providerId', () => {
      const result = createBookingSchema.safeParse({ ...valid, providerId: '' });
      expect(result.success).toBe(false);
    });

    it('rejects missing customerId', () => {
      const result = createBookingSchema.safeParse({ ...valid, customerId: '' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid datetime for startTime', () => {
      const result = createBookingSchema.safeParse({ ...valid, startTime: 'not-a-date' });
      expect(result.success).toBe(false);
    });
  });

  describe('updateBookingStatusSchema', () => {
    it('validates CONFIRMED status', () => {
      const result = updateBookingStatusSchema.safeParse({ status: 'CONFIRMED' });
      expect(result.success).toBe(true);
    });

    it('validates CANCELLED with cancelReason', () => {
      const result = updateBookingStatusSchema.safeParse({ status: 'CANCELLED', cancelReason: 'Customer no-show' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid status', () => {
      const result = updateBookingStatusSchema.safeParse({ status: 'UNKNOWN' });
      expect(result.success).toBe(false);
    });

    it('rejects missing status', () => {
      const result = updateBookingStatusSchema.safeParse({ cancelReason: 'test' });
      expect(result.success).toBe(false);
    });
  });

  describe('paginationSchema', () => {
    it('accepts empty object', () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('accepts status filter', () => {
      const result = paginationSchema.safeParse({ status: 'PENDING' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid status in filter', () => {
      const result = paginationSchema.safeParse({ status: 'UNKNOWN' });
      expect(result.success).toBe(false);
    });

    it('accepts date range', () => {
      const result = paginationSchema.safeParse({ startDate: '2024-01-01', endDate: '2024-12-31' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid sortOrder', () => {
      const result = paginationSchema.safeParse({ sortOrder: 'random' });
      expect(result.success).toBe(false);
    });
  });
});
