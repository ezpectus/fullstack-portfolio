import { describe, it, expect } from 'vitest';
import { createReservationSchema, reservationPaginationSchema } from './reservations.dto';

describe('reservations.dto', () => {
  it('validates create reservation input', () => {
    const result = createReservationSchema.safeParse({
      bookId: '550e8400-e29b-41d4-a716-446655440000',
      memberId: '550e8400-e29b-41d4-a716-446655440001',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid UUID', () => {
    const result = createReservationSchema.safeParse({ bookId: 'not-a-uuid', memberId: 'also-not' });
    expect(result.success).toBe(false);
  });

  it('applies pagination defaults', () => {
    const result = reservationPaginationSchema.safeParse({});
    expect(result.success).toBe(true);
    expect(result.data?.page).toBe(1);
    expect(result.data?.limit).toBe(20);
  });

  it('validates status enum', () => {
    const result = reservationPaginationSchema.safeParse({ status: 'INVALID' });
    expect(result.success).toBe(false);
  });
});
