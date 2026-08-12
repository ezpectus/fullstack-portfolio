import { describe, it, expect } from 'vitest';
import { createTemplateSchema, updateTemplateSchema, templatePaginationSchema } from './templates.dto';

describe('Templates DTOs', () => {
  describe('createTemplateSchema', () => {
    it('validates a correct template', () => {
      const result = createTemplateSchema.safeParse({
        name: 'Web Development',
        description: 'Hourly rate',
        quantity: 1,
        unit: 'hours',
        unitPrice: 80,
        taxRate: 10,
        discount: 0,
      });
      expect(result.success).toBe(true);
    });

    it('rejects missing name', () => {
      const result = createTemplateSchema.safeParse({
        description: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('rejects negative quantity', () => {
      const result = createTemplateSchema.safeParse({
        name: 'Test',
        description: 'Test',
        quantity: -1,
      });
      expect(result.success).toBe(false);
    });

    it('applies defaults', () => {
      const result = createTemplateSchema.safeParse({
        name: 'Test',
        description: 'Test',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.quantity).toBe(1);
        expect(result.data.unit).toBe('pcs');
        expect(result.data.unitPrice).toBe(0);
        expect(result.data.taxRate).toBe(0);
        expect(result.data.discount).toBe(0);
      }
    });
  });

  describe('updateTemplateSchema', () => {
    it('accepts partial update', () => {
      const result = updateTemplateSchema.safeParse({ name: 'Updated' });
      expect(result.success).toBe(true);
    });
  });

  describe('templatePaginationSchema', () => {
    it('applies defaults', () => {
      const result = templatePaginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });
  });
});
