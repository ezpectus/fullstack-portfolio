import { describe, it, expect } from 'vitest';
import { updateUserSchema, paginationSchema } from './users.dto';

describe('updateUserSchema', () => {
  it('should validate a valid update payload', () => {
    const result = updateUserSchema.parse({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      isActive: true,
    });
    expect(result).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      isActive: true,
    });
  });

  it('should validate a partial update', () => {
    const result = updateUserSchema.parse({ name: 'Jane Doe' });
    expect(result).toEqual({ name: 'Jane Doe' });
  });

  it('should validate an empty object', () => {
    const result = updateUserSchema.parse({});
    expect(result).toEqual({});
  });

  it('should reject invalid email', () => {
    expect(() => updateUserSchema.parse({ email: 'not-an-email' })).toThrow();
  });

  it('should reject invalid role', () => {
    expect(() => updateUserSchema.parse({ role: 'superadmin' })).toThrow();
  });

  it('should reject name that is too long', () => {
    expect(() => updateUserSchema.parse({ name: 'a'.repeat(256) })).toThrow();
  });

  it('should accept a valid avatar URL', () => {
    const result = updateUserSchema.parse({ avatar: 'https://example.com/avatar.png' });
    expect(result.avatar).toBe('https://example.com/avatar.png');
  });

  it('should reject invalid avatar URL', () => {
    expect(() => updateUserSchema.parse({ avatar: 'not-a-url' })).toThrow();
  });
});

describe('paginationSchema', () => {
  it('should use defaults when no values provided', () => {
    const result = paginationSchema.parse({});
    expect(result).toEqual({ page: 1, limit: 20 });
  });

  it('should parse valid page and limit strings', () => {
    const result = paginationSchema.parse({ page: '3', limit: '50' });
    expect(result).toEqual({ page: 3, limit: 50 });
  });

  it('should accept optional search', () => {
    const result = paginationSchema.parse({ search: 'john' });
    expect(result).toEqual({ page: 1, limit: 20, search: 'john' });
  });
});
