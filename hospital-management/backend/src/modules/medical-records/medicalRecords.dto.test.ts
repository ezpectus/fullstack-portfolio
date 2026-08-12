import { describe, it, expect } from 'vitest';
import { createMedicalRecordSchema, updateMedicalRecordSchema } from './medicalRecords.dto';

describe('Medical Records DTO', () => {
  it('createMedicalRecordSchema validates valid input', () => {
    const result = createMedicalRecordSchema.safeParse({
      appointmentId: '550e8400-e29b-41d4-a716-446655440000',
      complaints: 'Chest pain',
      examination: 'Normal heart sounds',
      diagnosis: 'Stable angina',
      prescriptions: 'Aspirin 100mg daily',
    });
    expect(result.success).toBe(true);
  });

  it('createMedicalRecordSchema rejects invalid UUID', () => {
    const result = createMedicalRecordSchema.safeParse({
      appointmentId: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });

  it('updateMedicalRecordSchema allows partial updates', () => {
    const result = updateMedicalRecordSchema.safeParse({
      diagnosis: 'Updated diagnosis',
    });
    expect(result.success).toBe(true);
  });
});
