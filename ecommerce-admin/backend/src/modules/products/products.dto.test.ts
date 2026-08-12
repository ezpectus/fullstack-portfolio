import { describe, it, expect } from 'vitest';
import { createProductSchema, updateProductSchema, paginationSchema } from './products.dto';

describe('products.dto', () => {
  describe('createProductSchema', () => {
    const validPayload = {
      sku: 'SKU-001',
      name: 'Test Product',
      price: 29.99,
    };

    it('validates a correct product payload', () => {
      const result = createProductSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('defaults status to DRAFT', () => {
      const result = createProductSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('DRAFT');
      }
    });

    it('defaults stock to 0', () => {
      const result = createProductSchema.safeParse(validPayload);
      if (result.success) {
        expect(result.data.stock).toBe(0);
      }
    });

    it('rejects a SKU shorter than 3 chars', () => {
      const result = createProductSchema.safeParse({ ...validPayload, sku: 'AB' });
      expect(result.success).toBe(false);
    });

    it('rejects a negative price', () => {
      const result = createProductSchema.safeParse({ ...validPayload, price: -1 });
      expect(result.success).toBe(false);
    });

    it('rejects a negative stock', () => {
      const result = createProductSchema.safeParse({ ...validPayload, stock: -5 });
      expect(result.success).toBe(false);
    });

    it('rejects an invalid status', () => {
      const result = createProductSchema.safeParse({ ...validPayload, status: 'INVALID' });
      expect(result.success).toBe(false);
    });

    it('accepts variants array', () => {
      const result = createProductSchema.safeParse({
        ...validPayload,
        variants: [{ sku: 'VAR-001', name: 'Large Red', price: 34.99, stock: 10 }],
      });
      expect(result.success).toBe(true);
    });

    it('rejects variant with short SKU', () => {
      const result = createProductSchema.safeParse({
        ...validPayload,
        variants: [{ sku: 'AB', name: 'Small', price: 10 }],
      });
      expect(result.success).toBe(false);
    });

    it('accepts images array', () => {
      const result = createProductSchema.safeParse({
        ...validPayload,
        images: [{ url: 'https://example.com/img.jpg', position: 0 }],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('updateProductSchema', () => {
    it('allows partial updates', () => {
      const result = updateProductSchema.safeParse({ name: 'Updated Name' });
      expect(result.success).toBe(true);
    });

    it('allows empty object', () => {
      const result = updateProductSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('accepts empty object', () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('accepts search and status', () => {
      const result = paginationSchema.safeParse({ search: 'shirt', status: 'ACTIVE' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid sortOrder', () => {
      const result = paginationSchema.safeParse({ sortOrder: 'random' });
      expect(result.success).toBe(false);
    });
  });
});
