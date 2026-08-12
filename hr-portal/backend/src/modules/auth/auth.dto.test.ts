import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.dto';

describe('registerSchema', () => {
  it('validates a correct registration payload', () => {
    const result = registerSchema.parse({
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
    });
    expect(result.email).toBe('test@example.com');
  });

  it('rejects invalid email', () => {
    expect(() => registerSchema.parse({ email: 'not-an-email', password: 'password123', name: 'John' })).toThrow();
  });

  it('rejects short password', () => {
    expect(() => registerSchema.parse({ email: 'test@example.com', password: '12345', name: 'John' })).toThrow();
  });

  it('rejects short name', () => {
    expect(() => registerSchema.parse({ email: 'test@example.com', password: 'password123', name: 'J' })).toThrow();
  });

  it('rejects custom role (registration does not allow role selection)', () => {
    expect(() => registerSchema.parse({
      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin User',
      role: 'HR_ADMIN',
    })).toThrow();
  });
});

describe('loginSchema', () => {
  it('validates correct login payload', () => {
    const result = loginSchema.parse({ email: 'test@example.com', password: 'password' });
    expect(result.email).toBe('test@example.com');
  });

  it('rejects invalid email', () => {
    expect(() => loginSchema.parse({ email: 'invalid', password: 'password' })).toThrow();
  });

  it('rejects empty password', () => {
    expect(() => loginSchema.parse({ email: 'test@example.com', password: '' })).toThrow();
  });
});

describe('refreshTokenSchema', () => {
  it('validates correct refresh token', () => {
    const result = refreshTokenSchema.parse({ refreshToken: 'some-token-value' });
    expect(result.refreshToken).toBe('some-token-value');
  });

  it('rejects empty token', () => {
    expect(() => refreshTokenSchema.parse({ refreshToken: '' })).toThrow();
  });
});
