import { describe, it, expect } from 'vitest';
import { createProductSchema, updateProductSchema, productPaginationSchema } from './products.dto';

describe('Products DTO', () => {
  describe('createProductSchema', () => {
    it('should accept valid product', () => {
      const result = createProductSchema.safeParse({
        sku: 'TEST-001',
        name: 'Test Product',
        unit: 'pcs',
        minStock: 5,
        costPrice: 10,
        sellPrice: 20,
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing sku', () => {
      const result = createProductSchema.safeParse({ name: 'Test' });
      expect(result.success).toBe(false);
    });

    it('should reject negative price', () => {
      const result = createProductSchema.safeParse({
        sku: 'TEST-001',
        name: 'Test',
        costPrice: -5,
      });
      expect(result.success).toBe(false);
    });

    it('should apply defaults', () => {
      const result = createProductSchema.safeParse({
        sku: 'TEST-001',
        name: 'Test',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.unit).toBe('pcs');
        expect(result.data.minStock).toBe(0);
      }
    });
  });

  describe('updateProductSchema', () => {
    it('should accept partial update', () => {
      const result = updateProductSchema.safeParse({ name: 'Updated' });
      expect(result.success).toBe(true);
    });
  });

  describe('productPaginationSchema', () => {
    it('should apply defaults', () => {
      const result = productPaginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });

    it('should reject limit > 100', () => {
      const result = productPaginationSchema.safeParse({ limit: 200 });
      expect(result.success).toBe(false);
    });
  });
});
