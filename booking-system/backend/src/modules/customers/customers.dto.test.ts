import { describe, it, expect } from 'vitest';
import { createCustomerSchema, updateCustomerSchema, paginationSchema } from './customers.dto';

describe('customers.dto', () => {
  describe('createCustomerSchema', () => {
    it('validates a correct customer', () => {
      const result = createCustomerSchema.safeParse({ name: 'Jane Doe', email: 'jane@example.com' });
      expect(result.success).toBe(true);
    });

    it('accepts optional phone and notes', () => {
      const result = createCustomerSchema.safeParse({ name: 'Jane', email: 'jane@example.com', phone: '+1234567890', notes: 'VIP' });
      expect(result.success).toBe(true);
    });

    it('rejects short name', () => {
      const result = createCustomerSchema.safeParse({ name: 'A', email: 'jane@example.com' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
      const result = createCustomerSchema.safeParse({ name: 'Jane', email: 'nope' });
      expect(result.success).toBe(false);
    });
  });

  describe('updateCustomerSchema', () => {
    it('allows partial update', () => {
      const result = updateCustomerSchema.safeParse({ phone: '+9999999999' });
      expect(result.success).toBe(true);
    });

    it('still validates email format when provided', () => {
      const result = updateCustomerSchema.safeParse({ email: 'nope' });
      expect(result.success).toBe(false);
    });

    it('still validates name min length when provided', () => {
      const result = updateCustomerSchema.safeParse({ name: 'A' });
      expect(result.success).toBe(false);
    });
  });

  describe('paginationSchema', () => {
    it('rejects invalid sortOrder', () => {
      const result = paginationSchema.safeParse({ sortOrder: 'random' });
      expect(result.success).toBe(false);
    });
  });
});
