import { describe, it, expect } from 'vitest';
import { updateMemberSchema, memberPaginationSchema } from './members.dto';

describe('updateMemberSchema', () => {
  it('should validate valid phone update', () => {
    const result = updateMemberSchema.parse({ phone: '+1234567890' });
    expect(result.phone).toBe('+1234567890');
  });

  it('should validate valid status', () => {
    const result = updateMemberSchema.parse({ status: 'ACTIVE' });
    expect(result.status).toBe('ACTIVE');
  });

  it('should reject invalid status', () => {
    expect(() => updateMemberSchema.parse({ status: 'INVALID' })).toThrow();
  });

  it('should allow empty object', () => {
    const result = updateMemberSchema.parse({});
    expect(result.phone).toBeUndefined();
  });
});

describe('memberPaginationSchema', () => {
  it('should use defaults', () => {
    const result = memberPaginationSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('should coerce string numbers', () => {
    const result = memberPaginationSchema.parse({ page: '3', limit: '50' });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(50);
  });

  it('should accept search and status', () => {
    const result = memberPaginationSchema.parse({ search: 'john', status: 'ACTIVE' });
    expect(result.search).toBe('john');
    expect(result.status).toBe('ACTIVE');
  });

  it('should reject limit > 100', () => {
    expect(() => memberPaginationSchema.parse({ limit: 200 })).toThrow();
  });
});
