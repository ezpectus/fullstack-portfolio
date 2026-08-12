import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, refreshSchema } from './auth.dto';

describe('Auth DTOs', () => {
  describe('registerSchema', () => {
    it('validates a correct registration', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = registerSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
        name: 'Test User',
      });
      expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: '12345',
        name: 'Test User',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty name', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        name: '',
      });
      expect(result.success).toBe(false);
    });

    it('accepts optional role', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'ACCOUNTANT',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('loginSchema', () => {
    it('validates correct login', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects missing password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('refreshSchema', () => {
    it('validates with token', () => {
      const result = refreshSchema.safeParse({ refreshToken: 'some-token' });
      expect(result.success).toBe(true);
    });

    it('rejects empty token', () => {
      const result = refreshSchema.safeParse({ refreshToken: '' });
      expect(result.success).toBe(false);
    });
  });
});
