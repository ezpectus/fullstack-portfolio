import { describe, it, expect } from 'vitest';
import { createOrderSchema, updateOrderStatusSchema, paginationSchema } from './orders.dto';

describe('orders.dto', () => {
  describe('createOrderSchema', () => {
    const validPayload = {
      customerId: '550e8400-e29b-41d4-a716-446655440000',
      items: [{ productId: '550e8400-e29b-41d4-a716-446655440001', quantity: 2 }],
    };

    it('validates a correct order payload', () => {
      const result = createOrderSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('rejects empty items array', () => {
      const result = createOrderSchema.safeParse({ ...validPayload, items: [] });
      expect(result.success).toBe(false);
    });

    it('rejects invalid customerId (non-UUID)', () => {
      const result = createOrderSchema.safeParse({ ...validPayload, customerId: 'not-a-uuid' });
      expect(result.success).toBe(false);
    });

    it('rejects quantity less than 1', () => {
      const result = createOrderSchema.safeParse({
        ...validPayload,
        items: [{ productId: '550e8400-e29b-41d4-a716-446655440001', quantity: 0 }],
      });
      expect(result.success).toBe(false);
    });

    it('accepts optional fields', () => {
      const result = createOrderSchema.safeParse({
        ...validPayload,
        shippingAddress: '123 Main St',
        notes: 'Leave at door',
        promoCodeId: '550e8400-e29b-41d4-a716-446655440002',
      });
      expect(result.success).toBe(true);
    });

    it('accepts variantId as optional UUID', () => {
      const result = createOrderSchema.safeParse({
        ...validPayload,
        items: [{ productId: '550e8400-e29b-41d4-a716-446655440001', variantId: '550e8400-e29b-41d4-a716-446655440003', quantity: 1 }],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('updateOrderStatusSchema', () => {
    it('validates a correct status update', () => {
      const result = updateOrderStatusSchema.safeParse({ status: 'SHIPPED' });
      expect(result.success).toBe(true);
    });

    it('accepts a comment', () => {
      const result = updateOrderStatusSchema.safeParse({ status: 'DELIVERED', comment: 'Package received' });
      expect(result.success).toBe(true);
    });

    it('rejects an invalid status', () => {
      const result = updateOrderStatusSchema.safeParse({ status: 'UNKNOWN' });
      expect(result.success).toBe(false);
    });

    it('rejects missing status', () => {
      const result = updateOrderStatusSchema.safeParse({ comment: 'test' });
      expect(result.success).toBe(false);
    });
  });

  describe('paginationSchema', () => {
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
