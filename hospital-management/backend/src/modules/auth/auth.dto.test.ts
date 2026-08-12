import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.dto';

describe('Auth DTO', () => {
  it('registerSchema validates valid input', () => {
    const result = registerSchema.safeParse({
      email: 'test@hospital.com',
      password: 'password123',
      name: 'Test User',
    });
    expect(result.success).toBe(true);
  });

  it('registerSchema rejects invalid email', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
      name: 'Test User',
    });
    expect(result.success).toBe(false);
  });

  it('registerSchema rejects short password', () => {
    const result = registerSchema.safeParse({
      email: 'test@hospital.com',
      password: '12345',
      name: 'Test User',
    });
    expect(result.success).toBe(false);
  });

  it('loginSchema validates valid input', () => {
    const result = loginSchema.safeParse({
      email: 'test@hospital.com',
      password: 'password',
    });
    expect(result.success).toBe(true);
  });

  it('refreshTokenSchema validates valid input', () => {
    const result = refreshTokenSchema.safeParse({ refreshToken: 'some-token' });
    expect(result.success).toBe(true);
  });
});
