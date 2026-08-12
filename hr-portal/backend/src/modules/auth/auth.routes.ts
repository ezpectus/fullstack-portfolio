import { Router } from 'express';
import authService from './auth.service';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody } from '../../middleware/validate';
import { loginSchema, registerSchema, refreshTokenSchema, inviteSchema } from './auth.dto';
import { authRateLimiter } from '../../middleware/rateLimit';
import { requireRole } from '../../middleware/rbac';

const router = Router();

router.post('/register', authRateLimiter, validateBody(registerSchema), asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
}));

router.post('/login', authRateLimiter, validateBody(loginSchema), asyncHandler(async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);
  res.json(result);
}));

router.post('/refresh', authRateLimiter, validateBody(refreshTokenSchema), asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body.refreshToken);
  res.json(result);
}));

router.post('/logout', authRateLimiter, authenticate, validateBody(refreshTokenSchema), asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(204).send();
}));

router.get('/me', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const user = await authService.getMe(req.user!.userId);
  res.json(user);
}));

router.post('/invite', authenticate, authRateLimiter, requireRole('HR_ADMIN'), validateBody(inviteSchema), asyncHandler(async (req, res) => {
  const result = await authService.invite(req.body);
  res.status(201).json(result);
}));

export default router;
