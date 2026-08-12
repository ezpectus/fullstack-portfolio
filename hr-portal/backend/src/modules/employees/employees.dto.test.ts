import { describe, it, expect } from 'vitest';
import { createEmployeeSchema, updateEmployeeSchema, listEmployeesSchema } from './employees.dto';

describe('createEmployeeSchema', () => {
  const validData = {
    userId: '550e8400-e29b-41d4-a716-446655440000',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    position: 'Developer',
    hireDate: '2023-01-15',
    salary: 50000,
  };

  it('validates correct employee data', () => {
    const result = createEmployeeSchema.parse(validData);
    expect(result.firstName).toBe('John');
    expect(result.salary).toBe(50000);
  });

  it('rejects missing firstName', () => {
    expect(() => createEmployeeSchema.parse({ ...validData, firstName: '' })).toThrow();
  });

  it('rejects missing lastName', () => {
    expect(() => createEmployeeSchema.parse({ ...validData, lastName: '' })).toThrow();
  });

  it('rejects invalid UUID', () => {
    expect(() => createEmployeeSchema.parse({ ...validData, userId: 'not-a-uuid' })).toThrow();
  });

  it('rejects negative salary', () => {
    expect(() => createEmployeeSchema.parse({ ...validData, salary: -100 })).toThrow();
  });

  it('accepts optional fields', () => {
    const result = createEmployeeSchema.parse({
      ...validData,
      phone: '+1234567890',
      education: 'BSc',
      experience: '5 years',
      skills: 'React, Node',
    });
    expect(result.phone).toBe('+1234567890');
  });
});

describe('updateEmployeeSchema', () => {
  it('validates partial update', () => {
    const result = updateEmployeeSchema.parse({ firstName: 'Jane' });
    expect(result.firstName).toBe('Jane');
  });

  it('validates status update', () => {
    const result = updateEmployeeSchema.parse({ status: 'ON_LEAVE' });
    expect(result.status).toBe('ON_LEAVE');
  });

  it('rejects invalid status', () => {
    expect(() => updateEmployeeSchema.parse({ status: 'INVALID' })).toThrow();
  });
});

describe('listEmployeesSchema', () => {
  it('validates pagination params', () => {
    const result = listEmployeesSchema.parse({ page: 1, limit: 10 });
    expect(result.page).toBe(1);
  });

  it('validates status filter', () => {
    const result = listEmployeesSchema.parse({ status: 'ACTIVE' });
    expect(result.status).toBe('ACTIVE');
  });

  it('rejects page less than 1', () => {
    expect(() => listEmployeesSchema.parse({ page: 0 })).toThrow();
  });
});
