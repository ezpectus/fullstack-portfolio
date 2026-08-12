import { z } from 'zod';

export const createNoteSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  isPinned: z.boolean().optional().default(false),
  customerId: z.string().uuid().optional(),
  dealId: z.string().uuid().optional(),
}).refine((data) => data.customerId || data.dealId, {
  message: 'Note must be attached to a customer or a deal',
  path: ['customerId'],
});

export const updateNoteSchema = z.object({
  content: z.string().min(1).optional(),
  isPinned: z.boolean().optional(),
});

export const noteQuerySchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 20)),
  customerId: z.string().uuid().optional(),
  dealId: z.string().uuid().optional(),
  isPinned: z.enum(['true', 'false']).optional().transform((v) => (v === undefined ? undefined : v === 'true')),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
