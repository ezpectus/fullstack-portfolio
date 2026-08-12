import { describe, it, expect } from 'vitest';
import { createCopySchema, updateCopySchema, copyPaginationSchema } from './book-copies.dto';

describe('createCopySchema', () => {
  it('should validate valid input', () => {
    const result = createCopySchema.parse({
      bookId: '550e8400-e29b-41d4-a716-446655440000',
      code: 'COPY-001',
      condition: 'good',
    });
    expect(result.code).toBe('COPY-001');
    expect(result.condition).toBe('good');
  });

  it('should use default condition', () => {
    const result = createCopySchema.parse({
      bookId: '550e8400-e29b-41d4-a716-446655440000',
      code: 'COPY-002',
    });
    expect(result.condition).toBe('good');
  });

  it('should reject empty code', () => {
    expect(() =>
      createCopySchema.parse({
        bookId: '550e8400-e29b-41d4-a716-446655440000',
        code: '',
      }),
    ).toThrow();
  });

  it('should reject invalid bookId', () => {
    expect(() =>
      createCopySchema.parse({
        bookId: 'not-a-uuid',
        code: 'COPY-003',
      }),
    ).toThrow();
  });
});

describe('updateCopySchema', () => {
  it('should validate valid status', () => {
    const result = updateCopySchema.parse({ status: 'AVAILABLE' });
    expect(result.status).toBe('AVAILABLE');
  });

  it('should validate valid condition', () => {
    const result = updateCopySchema.parse({ condition: 'excellent' });
    expect(result.condition).toBe('excellent');
  });

  it('should reject invalid status', () => {
    expect(() => updateCopySchema.parse({ status: 'INVALID' })).toThrow();
  });

  it('should allow empty object', () => {
    const result = updateCopySchema.parse({});
    expect(result.status).toBeUndefined();
  });
});

describe('copyPaginationSchema', () => {
  it('should use defaults', () => {
    const result = copyPaginationSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('should coerce string numbers', () => {
    const result = copyPaginationSchema.parse({ page: '2', limit: '10' });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
  });

  it('should reject limit > 100', () => {
    expect(() => copyPaginationSchema.parse({ limit: 200 })).toThrow();
  });
});
