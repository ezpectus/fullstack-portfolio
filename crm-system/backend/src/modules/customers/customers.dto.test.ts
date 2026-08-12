import { describe, it, expect } from 'vitest';
import { createCustomerSchema, updateCustomerSchema, customerQuerySchema } from './customers.dto';

describe('Customers DTO', () => {
  describe('createCustomerSchema', () => {
    it('validates minimal correct input', () => {
      const result = createCustomerSchema.safeParse({ name: 'Acme Corp' });
      expect(result.success).toBe(true);
    });

    it('validates full correct input', () => {
      const result = createCustomerSchema.safeParse({
        name: 'Acme Corp',
        company: 'Acme',
        email: 'contact@acme.com',
        phone: '+1-555-0100',
        status: 'active',
        tags: ['vip', 'enterprise'],
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty name', () => {
      const result = createCustomerSchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
      const result = createCustomerSchema.safeParse({
        name: 'Acme',
        email: 'not-email',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid status', () => {
      const result = createCustomerSchema.safeParse({
        name: 'Acme',
        status: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateCustomerSchema', () => {
    it('allows partial updates', () => {
      const result = updateCustomerSchema.safeParse({ name: 'Updated Name' });
      expect(result.success).toBe(true);
    });

    it('allows empty object', () => {
      const result = updateCustomerSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('customerQuerySchema', () => {
    it('parses pagination from strings', () => {
      const result = customerQuerySchema.safeParse({ page: '2', limit: '50' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(50);
      }
    });

    it('uses defaults when empty', () => {
      const result = customerQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });
  });
});
