import { describe, it, expect } from 'vitest';
import { createPayslipSchema, updatePayslipSchema, listPayslipSchema } from './payroll.dto';

describe('createPayslipSchema', () => {
  const validData = {
    employeeId: '550e8400-e29b-41d4-a716-446655440000',
    month: 6,
    year: 2024,
    baseSalary: 5000,
  };

  it('validates correct payslip data', () => {
    const result = createPayslipSchema.parse(validData);
    expect(result.month).toBe(6);
    expect(result.year).toBe(2024);
    expect(result.bonus).toBe(0);
  });

  it('rejects invalid month', () => {
    expect(() => createPayslipSchema.parse({ ...validData, month: 13 })).toThrow();
  });

  it('rejects month less than 1', () => {
    expect(() => createPayslipSchema.parse({ ...validData, month: 0 })).toThrow();
  });

  it('rejects year before 2000', () => {
    expect(() => createPayslipSchema.parse({ ...validData, year: 1999 })).toThrow();
  });

  it('rejects negative baseSalary', () => {
    expect(() => createPayslipSchema.parse({ ...validData, baseSalary: -100 })).toThrow();
  });

  it('accepts bonus, allowances, deductions', () => {
    const result = createPayslipSchema.parse({
      ...validData,
      bonus: 500,
      allowances: 200,
      deductions: 100,
    });
    expect(result.bonus).toBe(500);
  });
});

describe('updatePayslipSchema', () => {
  it('validates partial update', () => {
    const result = updatePayslipSchema.parse({ bonus: 1000 });
    expect(result.bonus).toBe(1000);
  });

  it('validates status update', () => {
    const result = updatePayslipSchema.parse({ status: 'APPROVED' });
    expect(result.status).toBe('APPROVED');
  });

  it('rejects invalid status', () => {
    expect(() => updatePayslipSchema.parse({ status: 'INVALID' })).toThrow();
  });
});

describe('listPayslipSchema', () => {
  it('validates with filters', () => {
    const result = listPayslipSchema.parse({ status: 'PAID', month: 6, year: 2024 });
    expect(result.status).toBe('PAID');
  });

  it('validates pagination', () => {
    const result = listPayslipSchema.parse({ page: 1, limit: 20 });
    expect(result.page).toBe(1);
  });
});
