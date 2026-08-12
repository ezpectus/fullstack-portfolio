import { describe, it, expect } from 'vitest';
import { createPromoSchema, updatePromoSchema, paginationSchema } from './promo-codes.dto';

describe('promo-codes.dto', () => {
  describe('createPromoSchema', () => {
    const validPayload = {
      code: 'SUMMER20',
      type: 'PERCENTAGE' as const,
      value: 20,
    };

    it('validates a correct promo payload', () => {
      const result = createPromoSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('defaults isActive to true', () => {
      const result = createPromoSchema.safeParse(validPayload);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });

    it('defaults minOrderValue to 0', () => {
      const result = createPromoSchema.safeParse(validPayload);
      if (result.success) {
        expect(result.data.minOrderValue).toBe(0);
      }
    });

    it('rejects a code shorter than 3 chars', () => {
      const result = createPromoSchema.safeParse({ ...validPayload, code: 'AB' });
      expect(result.success).toBe(false);
    });

    it('rejects a code longer than 50 chars', () => {
      const result = createPromoSchema.safeParse({ ...validPayload, code: 'A'.repeat(51) });
      expect(result.success).toBe(false);
    });

    it('rejects an invalid type', () => {
      const result = createPromoSchema.safeParse({ ...validPayload, type: 'BOGO' });
      expect(result.success).toBe(false);
    });

    it('rejects a negative value', () => {
      const result = createPromoSchema.safeParse({ ...validPayload, value: -5 });
      expect(result.success).toBe(false);
    });

    it('accepts FIXED type', () => {
      const result = createPromoSchema.safeParse({ ...validPayload, type: 'FIXED', value: 15 });
      expect(result.success).toBe(true);
    });

    it('accepts usageLimit as optional integer', () => {
      const result = createPromoSchema.safeParse({ ...validPayload, usageLimit: 100 });
      expect(result.success).toBe(true);
    });

    it('rejects usageLimit of 0', () => {
      const result = createPromoSchema.safeParse({ ...validPayload, usageLimit: 0 });
      expect(result.success).toBe(false);
    });

    it('accepts expiresAt as ISO datetime', () => {
      const result = createPromoSchema.safeParse({ ...validPayload, expiresAt: '2024-12-31T23:59:59Z' });
      expect(result.success).toBe(true);
    });
  });

  describe('updatePromoSchema', () => {
    it('allows partial updates', () => {
      const result = updatePromoSchema.safeParse({ value: 30 });
      expect(result.success).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('accepts search and isActive', () => {
      const result = paginationSchema.safeParse({ search: 'summer', isActive: 'true' });
      expect(result.success).toBe(true);
    });
  });
});
