import { describe, it, expect } from 'vitest';
import { finePaginationSchema } from './fines.dto';

describe('fines.dto', () => {
  it('applies pagination defaults', () => {
    const result = finePaginationSchema.safeParse({});
    expect(result.success).toBe(true);
    expect(result.data?.page).toBe(1);
    expect(result.data?.limit).toBe(20);
  });

  it('validates status enum', () => {
    const valid = finePaginationSchema.safeParse({ status: 'PENDING' });
    expect(valid.success).toBe(true);

    const invalid = finePaginationSchema.safeParse({ status: 'INVALID' });
    expect(invalid.success).toBe(false);
  });

  it('accepts optional memberId UUID', () => {
    const result = finePaginationSchema.safeParse({
      memberId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid memberId', () => {
    const result = finePaginationSchema.safeParse({ memberId: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });
});
