import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, refreshSchema } from './auth.dto';

describe('auth.dto', () => {
  describe('registerSchema', () => {
    it('validates a correct registration', () => {
      const result = registerSchema.safeParse({ email: 'admin@booking.com', password: 'password123', name: 'Admin' });
      expect(result.success).toBe(true);
    });

    it('ignores extra fields like role', () => {
      const result = registerSchema.safeParse({ email: 'staff@booking.com', password: 'password123', name: 'Staff', role: 'PROVIDER' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = registerSchema.safeParse({ email: 'nope', password: 'password123', name: 'Test' });
      expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
      const result = registerSchema.safeParse({ email: 'test@booking.com', password: 'short', name: 'Test' });
      expect(result.success).toBe(false);
    });

    it('rejects short name', () => {
      const result = registerSchema.safeParse({ email: 'test@booking.com', password: 'password123', name: 'A' });
      expect(result.success).toBe(false);
    });

    it('rejects password without numbers', () => {
      const result = registerSchema.safeParse({ email: 'test@booking.com', password: 'password', name: 'Test' });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('validates correct login', () => {
      const result = loginSchema.safeParse({ email: 'admin@booking.com', password: 'password123' });
      expect(result.success).toBe(true);
    });

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({ email: 'admin@booking.com', password: '' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({ email: 'nope', password: 'password123' });
      expect(result.success).toBe(false);
    });
  });

  describe('refreshSchema', () => {
    it('validates a token', () => {
      const result = refreshSchema.safeParse({ refreshToken: 'some-token' });
      expect(result.success).toBe(true);
    });

    it('rejects empty token', () => {
      const result = refreshSchema.safeParse({ refreshToken: '' });
      expect(result.success).toBe(false);
    });
  });
});
