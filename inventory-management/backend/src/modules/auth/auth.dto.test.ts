import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, refreshSchema } from './auth.dto';

describe('Auth DTO', () => {
  describe('registerSchema', () => {
    it('should accept valid input', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = registerSchema.safeParse({
        email: 'invalid',
        password: 'password123',
        name: 'Test User',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: '12345',
        name: 'Test User',
      });
      expect(result.success).toBe(false);
    });

    it('should reject role in input (strict mode)', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'ADMIN',
      });
      expect(result.success).toBe(false);
    });

    it('should reject password without a number', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should accept valid input', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing password', () => {
      const result = loginSchema.safeParse({ email: 'test@example.com' });
      expect(result.success).toBe(false);
    });
  });

  describe('refreshSchema', () => {
    it('should accept valid token', () => {
      const result = refreshSchema.safeParse({ refreshToken: 'some-token' });
      expect(result.success).toBe(true);
    });

    it('should reject empty token', () => {
      const result = refreshSchema.safeParse({ refreshToken: '' });
      expect(result.success).toBe(false);
    });
  });
});
