import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, refreshSchema } from './auth.dto';

describe('auth.dto', () => {
  describe('registerSchema', () => {
    it('validates a correct registration payload', () => {
      const result = registerSchema.safeParse({
        email: 'admin@shop.com',
        password: 'password123',
        name: 'Admin User',
      });
      expect(result.success).toBe(true);
    });

    it('rejects role field (registration does not allow role selection)', () => {
      const result = registerSchema.safeParse({
        email: 'manager@shop.com',
        password: 'password123',
        name: 'Manager',
        role: 'MANAGER',
      });
      expect(result.success).toBe(false);
    });

    it('rejects an invalid email', () => {
      const result = registerSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
        name: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('rejects a password shorter than 8 chars', () => {
      const result = registerSchema.safeParse({
        email: 'test@shop.com',
        password: 'short',
        name: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('rejects a name shorter than 2 chars', () => {
      const result = registerSchema.safeParse({
        email: 'test@shop.com',
        password: 'password123',
        name: 'A',
      });
      expect(result.success).toBe(false);
    });

    it('rejects extra fields', () => {
      const result = registerSchema.safeParse({
        email: 'test@shop.com',
        password: 'password123',
        name: 'Test',
        extra: 'field',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('validates a correct login payload', () => {
      const result = loginSchema.safeParse({
        email: 'admin@shop.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects an empty password', () => {
      const result = loginSchema.safeParse({
        email: 'admin@shop.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });

    it('rejects an invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'nope',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('refreshSchema', () => {
    it('validates a correct refresh payload', () => {
      const result = refreshSchema.safeParse({ refreshToken: 'some-token' });
      expect(result.success).toBe(true);
    });

    it('rejects an empty token', () => {
      const result = refreshSchema.safeParse({ refreshToken: '' });
      expect(result.success).toBe(false);
    });
  });
});
