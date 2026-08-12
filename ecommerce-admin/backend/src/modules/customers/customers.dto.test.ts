import { describe, it, expect } from 'vitest';
import { createCustomerSchema, updateCustomerSchema, paginationSchema } from './customers.dto';

describe('customers.dto', () => {
  describe('createCustomerSchema', () => {
    const validPayload = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    it('validates a correct customer payload', () => {
      const result = createCustomerSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('defaults status to ACTIVE', () => {
      const result = createCustomerSchema.safeParse(validPayload);
      if (result.success) {
        expect(result.data.status).toBe('ACTIVE');
      }
    });

    it('defaults segment to NEW', () => {
      const result = createCustomerSchema.safeParse(validPayload);
      if (result.success) {
        expect(result.data.segment).toBe('NEW');
      }
    });

    it('rejects a name shorter than 2 chars', () => {
      const result = createCustomerSchema.safeParse({ ...validPayload, name: 'A' });
      expect(result.success).toBe(false);
    });

    it('rejects an invalid email', () => {
      const result = createCustomerSchema.safeParse({ ...validPayload, email: 'nope' });
      expect(result.success).toBe(false);
    });

    it('rejects an invalid status', () => {
      const result = createCustomerSchema.safeParse({ ...validPayload, status: 'DELETED' });
      expect(result.success).toBe(false);
    });

    it('rejects an invalid segment', () => {
      const result = createCustomerSchema.safeParse({ ...validPayload, segment: 'PREMIUM' });
      expect(result.success).toBe(false);
    });

    it('accepts addresses array', () => {
      const result = createCustomerSchema.safeParse({
        ...validPayload,
        addresses: [{ street: '123 Main St', city: 'NYC', postalCode: '10001' }],
      });
      expect(result.success).toBe(true);
    });

    it('address defaults country to USA and isDefault to false', () => {
      const result = createCustomerSchema.safeParse({
        ...validPayload,
        addresses: [{ street: '123 Main St', city: 'NYC', postalCode: '10001' }],
      });
      if (result.success && result.data.addresses) {
        expect(result.data.addresses[0].country).toBe('USA');
        expect(result.data.addresses[0].isDefault).toBe(false);
      }
    });
  });

  describe('updateCustomerSchema', () => {
    it('allows partial updates', () => {
      const result = updateCustomerSchema.safeParse({ name: 'Jane Doe' });
      expect(result.success).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('accepts search and segment', () => {
      const result = paginationSchema.safeParse({ search: 'john', segment: 'VIP' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid sortOrder', () => {
      const result = paginationSchema.safeParse({ sortOrder: 'random' });
      expect(result.success).toBe(false);
    });
  });
});
