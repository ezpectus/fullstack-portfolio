import { describe, it, expect } from 'vitest';
import { createLeaveRequestSchema, approveLeaveSchema, listLeaveSchema } from './leave.dto';

describe('createLeaveRequestSchema', () => {
  const validData = {
    employeeId: '550e8400-e29b-41d4-a716-446655440000',
    leaveType: 'ANNUAL',
    startDate: '2024-06-01',
    endDate: '2024-06-05',
  };

  it('validates correct leave request', () => {
    const result = createLeaveRequestSchema.parse(validData);
    expect(result.leaveType).toBe('ANNUAL');
  });

  it('rejects invalid leave type', () => {
    expect(() => createLeaveRequestSchema.parse({ ...validData, leaveType: 'INVALID' })).toThrow();
  });

  it('rejects invalid UUID', () => {
    expect(() => createLeaveRequestSchema.parse({ ...validData, employeeId: 'not-uuid' })).toThrow();
  });

  it('accepts optional comment', () => {
    const result = createLeaveRequestSchema.parse({ ...validData, comment: 'Family vacation' });
    expect(result.comment).toBe('Family vacation');
  });
});

describe('approveLeaveSchema', () => {
  it('validates with rejection reason', () => {
    const result = approveLeaveSchema.parse({ rejectionReason: 'Too many people on leave' });
    expect(result.rejectionReason).toBe('Too many people on leave');
  });

  it('validates without rejection reason', () => {
    const result = approveLeaveSchema.parse({});
    expect(result.rejectionReason).toBeUndefined();
  });
});

describe('listLeaveSchema', () => {
  it('validates with status filter', () => {
    const result = listLeaveSchema.parse({ status: 'PENDING' });
    expect(result.status).toBe('PENDING');
  });

  it('rejects invalid status', () => {
    expect(() => listLeaveSchema.parse({ status: 'INVALID' })).toThrow();
  });

  it('validates pagination', () => {
    const result = listLeaveSchema.parse({ page: 2, limit: 20 });
    expect(result.page).toBe(2);
  });
});
