import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, inviteSchema } from './auth.dto';

describe('Auth DTO', () => {
  describe('registerSchema', () => {
    it('validates correct input', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password1',
        name: 'Test User',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = registerSchema.safeParse({
        email: 'not-an-email',
        password: 'password1',
        name: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'short',
        name: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('rejects password without numbers', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'passwords',
        name: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty name', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password1',
        name: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('validates correct input', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'anypassword',
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

  describe('inviteSchema', () => {
    it('validates correct input with role', () => {
      const result = inviteSchema.safeParse({
        email: 'new@example.com',
        name: 'New User',
        role: 'manager',
        password: 'password1',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid role', () => {
      const result = inviteSchema.safeParse({
        email: 'new@example.com',
        name: 'New User',
        role: 'superadmin',
        password: 'password1',
      });
      expect(result.success).toBe(false);
    });
  });
});
