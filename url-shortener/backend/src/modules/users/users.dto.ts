import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  role: z.enum(['admin', 'user']).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
