import { Router } from 'express';
import { validateBody } from '../../middleware/validate';
import { authLimiter } from '../../middleware/rateLimit';
import { authenticate } from '../../middleware/auth';
import { requireRole, ROLES } from '../../middleware/rbac';
import { registerSchema, loginSchema, refreshSchema, inviteSchema } from './auth.dto';
import { register, login, refresh, logout, me, invite } from './auth.controller';

const router = Router();

router.post('/register', authLimiter, validateBody(registerSchema), register);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/refresh', authLimiter, validateBody(refreshSchema), refresh);
router.post('/logout', authenticate, authLimiter, logout);
router.get('/me', authenticate, me);
router.post('/invite', authenticate, authLimiter, requireRole(ROLES.ADMIN), validateBody(inviteSchema), invite);

export default router;
