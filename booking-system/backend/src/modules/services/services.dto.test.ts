import { describe, it, expect } from 'vitest';
import { createServiceSchema, updateServiceSchema, paginationSchema } from './services.dto';

describe('services.dto', () => {
  describe('createServiceSchema', () => {
    it('validates a correct service', () => {
      const result = createServiceSchema.safeParse({ name: 'Haircut', duration: 30 });
      expect(result.success).toBe(true);
    });

    it('defaults price to 0', () => {
      const result = createServiceSchema.safeParse({ name: 'Consultation', duration: 60 });
      if (result.success) expect(result.data.price).toBe(0);
    });

    it('defaults isActive to true', () => {
      const result = createServiceSchema.safeParse({ name: 'Massage', duration: 90 });
      if (result.success) expect(result.data.isActive).toBe(true);
    });

    it('rejects name shorter than 2 chars', () => {
      const result = createServiceSchema.safeParse({ name: 'A', duration: 30 });
      expect(result.success).toBe(false);
    });

    it('rejects duration less than 5', () => {
      const result = createServiceSchema.safeParse({ name: 'Quick', duration: 3 });
      expect(result.success).toBe(false);
    });

    it('rejects non-integer duration', () => {
      const result = createServiceSchema.safeParse({ name: 'Float', duration: 30.5 });
      expect(result.success).toBe(false);
    });

    it('rejects negative price', () => {
      const result = createServiceSchema.safeParse({ name: 'Test', duration: 30, price: -5 });
      expect(result.success).toBe(false);
    });

    it('accepts optional categoryId as UUID', () => {
      const result = createServiceSchema.safeParse({ name: 'Test', duration: 30, categoryId: '550e8400-e29b-41d4-a716-446655440000' });
      expect(result.success).toBe(true);
    });

    it('accepts nullable categoryId', () => {
      const result = createServiceSchema.safeParse({ name: 'Test', duration: 30, categoryId: null });
      expect(result.success).toBe(true);
    });
  });

  describe('updateServiceSchema', () => {
    it('allows partial update', () => {
      const result = updateServiceSchema.safeParse({ name: 'Updated' });
      expect(result.success).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('rejects invalid sortOrder', () => {
      const result = paginationSchema.safeParse({ sortOrder: 'random' });
      expect(result.success).toBe(false);
    });
  });
});
