import { z } from 'zod';

export const createMedicalRecordSchema = z.object({
  appointmentId: z.string().uuid(),
  complaints: z.string().optional(),
  examination: z.string().optional(),
  diagnosis: z.string().optional(),
  prescriptions: z.string().optional(),
  epicrisis: z.string().optional(),
  attachments: z.array(z.string()).default([]),
});

export const updateMedicalRecordSchema = createMedicalRecordSchema.partial();

export const listMedicalRecordsQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  patientId: z.string().uuid().optional(),
  doctorId: z.string().uuid().optional(),
});

export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordSchema>;
export type UpdateMedicalRecordInput = z.infer<typeof updateMedicalRecordSchema>;
