import { describe, it, expect } from 'vitest';
import { createAppointmentSchema, updateAppointmentStatusSchema } from './appointments.dto';

describe('Appointments DTO', () => {
  it('createAppointmentSchema validates valid input', () => {
    const result = createAppointmentSchema.safeParse({
      doctorId: '550e8400-e29b-41d4-a716-446655440000',
      patientId: '550e8400-e29b-41d4-a716-446655440001',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 1800000).toISOString(),
      reason: 'Regular checkup',
    });
    expect(result.success).toBe(true);
  });

  it('createAppointmentSchema rejects invalid UUID', () => {
    const result = createAppointmentSchema.safeParse({
      doctorId: 'not-a-uuid',
      patientId: '550e8400-e29b-41d4-a716-446655440001',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 1800000).toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it('updateAppointmentStatusSchema validates valid status', () => {
    const result = updateAppointmentStatusSchema.safeParse({ status: 'COMPLETED' });
    expect(result.success).toBe(true);
  });

  it('updateAppointmentStatusSchema rejects invalid status', () => {
    const result = updateAppointmentStatusSchema.safeParse({ status: 'INVALID' });
    expect(result.success).toBe(false);
  });
});
