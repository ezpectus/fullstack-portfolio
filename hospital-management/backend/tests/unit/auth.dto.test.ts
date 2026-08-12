import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, refreshTokenSchema } from '../../src/modules/auth/auth.dto';

describe('Auth DTO', () => {
  describe('registerSchema', () => {
    it('validates correct input', () => {
      const result = registerSchema.safeParse({
        email: 'test@hospital.com',
        password: 'pass123',
        name: 'Test User',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = registerSchema.safeParse({
        email: 'not-an-email',
        password: 'pass123',
        name: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
      const result = registerSchema.safeParse({
        email: 'test@hospital.com',
        password: '12345',
        name: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('rejects short name', () => {
      const result = registerSchema.safeParse({
        email: 'test@hospital.com',
        password: 'pass123',
        name: 'T',
      });
      expect(result.success).toBe(false);
    });

    it('does not include role in output (registration does not allow role selection)', () => {
      const result = registerSchema.safeParse({
        email: 'test@hospital.com',
        password: 'pass123',
        name: 'Test User',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBeUndefined();
      }
    });

    it('rejects role field (registration does not allow role selection)', () => {
      const result = registerSchema.safeParse({
        email: 'test@hospital.com',
        password: 'pass123',
        name: 'Test User',
        role: 'ADMIN',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('validates correct input', () => {
      const result = loginSchema.safeParse({
        email: 'test@hospital.com',
        password: 'pass123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@hospital.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid',
        password: 'pass123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('refreshTokenSchema', () => {
    it('validates correct token', () => {
      const result = refreshTokenSchema.safeParse({ refreshToken: 'some-token' });
      expect(result.success).toBe(true);
    });

    it('rejects empty token', () => {
      const result = refreshTokenSchema.safeParse({ refreshToken: '' });
      expect(result.success).toBe(false);
    });
  });
});
