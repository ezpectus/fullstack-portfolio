import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password is too long').regex(/[a-zA-Z]/, 'Password must contain letters').regex(/[0-9]/, 'Password must contain numbers'),
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').optional(),
});

export const inviteSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  role: z.enum(['admin', 'manager', 'sales_rep']),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password is too long'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type InviteInput = z.infer<typeof inviteSchema>;
