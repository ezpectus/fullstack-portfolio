import { Router } from 'express';
import { register, login, refresh, logout, me, invite } from './auth.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { authLimiter } from '../../middleware/rateLimit';
import { validateBody } from '../../middleware/validate';
import { registerSchema, loginSchema, refreshSchema, inviteSchema } from './auth.dto';
import { ROLES } from '../../shared/constants';

const router = Router();

router.post('/register', authLimiter, validateBody(registerSchema), register);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/refresh', authLimiter, validateBody(refreshSchema), refresh);
router.post('/logout', authenticate, authLimiter, logout);
router.get('/me', authenticate, me);
router.post('/invite', authenticate, authLimiter, requireRole(ROLES.ADMIN), validateBody(inviteSchema), invite);

export default router;
