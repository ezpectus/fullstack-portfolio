import { Response } from 'express';
import { AuthRequest, authenticate } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody } from '../../middleware/validate';
import { authRateLimiter } from '../../middleware/rateLimit';
import { authorize } from '../../middleware/rbac';
import { env } from '../../config/env';
import authService from './auth.service';
import { registerSchema, loginSchema, refreshTokenSchema, inviteSchema } from './auth.dto';
import { Router } from 'express';

const router = Router();

router.post('/register', authRateLimiter, validateBody(registerSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.register(req.body);
  res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: env.isProduction, sameSite: 'strict' });
  res.status(201).json(result);
}));

router.post('/login', authRateLimiter, validateBody(loginSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.login(req.body.email, req.body.password);
  res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: env.isProduction, sameSite: 'strict' });
  res.json(result);
}));

router.post('/refresh', authRateLimiter, validateBody(refreshTokenSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.refresh(req.body.refreshToken);
  res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: env.isProduction, sameSite: 'strict' });
  res.json(result);
}));

router.post('/logout', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  if (refreshToken) await authService.logout(refreshToken);
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
}));

router.get('/me', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: { message: 'Not authenticated' } });
  const user = await authService.me(req.user.userId);
  res.json(user);
}));

router.post('/invite', authenticate, authRateLimiter, authorize('ADMIN'), validateBody(inviteSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.invite(req.body, req.user!.userId);
  res.status(201).json(result);
}));

export default router;
