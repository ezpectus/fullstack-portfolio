import { Router } from 'express';
import { authController } from './auth.controller';
import { validateBody } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/rbac';
import { authRateLimiter } from '../../middleware/rateLimit';
import { registerSchema, loginSchema, refreshTokenSchema, inviteSchema } from './auth.dto';

const router = Router();

router.post('/register', authRateLimiter, validateBody(registerSchema), authController.register);
router.post('/login', authRateLimiter, validateBody(loginSchema), authController.login);
router.post('/refresh', authRateLimiter, validateBody(refreshTokenSchema), authController.refresh);
router.post('/logout', authRateLimiter, authController.logout);
router.get('/me', authenticate, authController.me);
router.post('/invite', authenticate, requireAdmin, validateBody(inviteSchema), authController.invite);

export default router;
