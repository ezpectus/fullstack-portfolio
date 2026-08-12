import { describe, it, expect } from 'vitest';
import { createClientSchema, updateClientSchema, clientPaginationSchema } from './clients.dto';

describe('Clients DTOs', () => {
  describe('createClientSchema', () => {
    it('validates a correct client', () => {
      const result = createClientSchema.safeParse({
        name: 'John Smith',
        email: 'john@example.com',
        company: 'Smith & Co',
      });
      expect(result.success).toBe(true);
    });

    it('rejects missing name', () => {
      const result = createClientSchema.safeParse({
        email: 'john@example.com',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
      const result = createClientSchema.safeParse({
        name: 'John',
        email: 'not-an-email',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateClientSchema', () => {
    it('accepts partial updates', () => {
      const result = updateClientSchema.safeParse({ name: 'Updated Name' });
      expect(result.success).toBe(true);
    });

    it('accepts empty object', () => {
      const result = updateClientSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('clientPaginationSchema', () => {
    it('applies defaults', () => {
      const result = clientPaginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
        expect(result.data.sortBy).toBe('createdAt');
        expect(result.data.sortOrder).toBe('desc');
      }
    });
  });
});
