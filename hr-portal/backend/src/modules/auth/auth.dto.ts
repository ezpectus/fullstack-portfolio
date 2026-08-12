import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password is too long').regex(/[a-zA-Z]/, 'Password must contain letters').regex(/[0-9]/, 'Password must contain numbers'),
  name: z.string().min(2),
  phone: z.string().optional(),
}).strict();

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const inviteSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(['HR_ADMIN', 'MANAGER', 'EMPLOYEE']),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password is too long').regex(/[a-zA-Z]/, 'Password must contain letters').regex(/[0-9]/, 'Password must contain numbers'),
  phone: z.string().optional(),
});

export type InviteInput = z.infer<typeof inviteSchema>;
