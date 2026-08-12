import { describe, it, expect } from 'vitest';
import { createLoanSchema, loanPaginationSchema } from './loans.dto';

describe('loans.dto', () => {
  it('validates create loan with required fields', () => {
    const result = createLoanSchema.safeParse({
      bookCopyId: '550e8400-e29b-41d4-a716-446655440000',
      memberId: '550e8400-e29b-41d4-a716-446655440001',
    });
    expect(result.success).toBe(true);
  });

  it('accepts optional dueDate', () => {
    const result = createLoanSchema.safeParse({
      bookCopyId: '550e8400-e29b-41d4-a716-446655440000',
      memberId: '550e8400-e29b-41d4-a716-446655440001',
      dueDate: '2025-12-31T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing bookCopyId', () => {
    const result = createLoanSchema.safeParse({ memberId: '550e8400-e29b-41d4-a716-446655440001' });
    expect(result.success).toBe(false);
  });

  it('applies pagination defaults', () => {
    const result = loanPaginationSchema.safeParse({});
    expect(result.success).toBe(true);
    expect(result.data?.page).toBe(1);
    expect(result.data?.limit).toBe(20);
  });

  it('validates status enum', () => {
    const result = loanPaginationSchema.safeParse({ status: 'INVALID' });
    expect(result.success).toBe(false);
  });
});
