import { describe, it, expect } from 'vitest';
import { updateUserSchema, paginationSchema } from './users.dto';

describe('Users DTOs', () => {
  describe('updateUserSchema', () => {
    it('accepts partial update', () => {
      const result = updateUserSchema.safeParse({ name: 'Updated' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = updateUserSchema.safeParse({ email: 'not-email' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid role', () => {
      const result = updateUserSchema.safeParse({ role: 'ADMIN' });
      expect(result.success).toBe(false);
    });

    it('accepts valid role', () => {
      expect(updateUserSchema.safeParse({ role: 'OWNER' }).success).toBe(true);
      expect(updateUserSchema.safeParse({ role: 'ACCOUNTANT' }).success).toBe(true);
      expect(updateUserSchema.safeParse({ role: 'VIEWER' }).success).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('applies defaults', () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });

    it('rejects limit > 100', () => {
      const result = paginationSchema.safeParse({ limit: 200 });
      expect(result.success).toBe(false);
    });
  });
});
