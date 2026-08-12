import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from './auth.dto';

describe('registerSchema', () => {
  it('should accept valid input', () => {
    const result = registerSchema.safeParse({ email: 'test@test.com', password: 'password123', name: 'Test' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = registerSchema.safeParse({ email: 'invalid', password: 'password123', name: 'Test' });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = registerSchema.safeParse({ email: 'test@test.com', password: 'short', name: 'Test' });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('should accept valid input', () => {
    const result = loginSchema.safeParse({ email: 'test@test.com', password: 'password' });
    expect(result.success).toBe(true);
  });

  it('should reject empty password', () => {
    const result = loginSchema.safeParse({ email: 'test@test.com', password: '' });
    expect(result.success).toBe(false);
  });
});
