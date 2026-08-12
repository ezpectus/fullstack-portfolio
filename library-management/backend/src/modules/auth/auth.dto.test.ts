import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, refreshSchema } from './auth.dto';

describe('Auth DTOs', () => {
  describe('registerSchema', () => {
    it('validates correct registration data', () => {
      const result = registerSchema.parse({ email: 'test@test.com', password: 'password123', name: 'Test User' });
      expect(result.email).toBe('test@test.com');
      expect(result.password).toBe('password123');
      expect(result.name).toBe('Test User');
    });

    it('rejects invalid email', () => {
      expect(() => registerSchema.parse({ email: 'not-email', password: 'password123', name: 'Test' })).toThrow();
    });

    it('rejects short password', () => {
      expect(() => registerSchema.parse({ email: 'test@test.com', password: '1234567', name: 'Test' })).toThrow();
    });

    it('rejects password without numbers', () => {
      expect(() => registerSchema.parse({ email: 'test@test.com', password: 'passwords', name: 'Test' })).toThrow();
    });

    it('rejects empty name', () => {
      expect(() => registerSchema.parse({ email: 'test@test.com', password: 'password123', name: '' })).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('validates correct login data', () => {
      const result = loginSchema.parse({ email: 'test@test.com', password: 'password123' });
      expect(result.email).toBe('test@test.com');
    });

    it('rejects invalid email', () => {
      expect(() => loginSchema.parse({ email: 'nope', password: 'pass' })).toThrow();
    });

    it('rejects empty password', () => {
      expect(() => loginSchema.parse({ email: 'test@test.com', password: '' })).toThrow();
    });
  });

  describe('refreshSchema', () => {
    it('validates refresh token', () => {
      const result = refreshSchema.parse({ refreshToken: 'some-token' });
      expect(result.refreshToken).toBe('some-token');
    });

    it('rejects empty token', () => {
      expect(() => refreshSchema.parse({ refreshToken: '' })).toThrow();
    });
  });
});
