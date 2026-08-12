import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { register, login, refresh, logout, me } from './auth.controller';
import { validateBody } from '../../middleware/validate';
import { registerSchema, loginSchema, refreshSchema } from './auth.dto';
import { authRateLimiter } from '../../middleware/rateLimit';

const router = Router();

router.post('/register', authRateLimiter, validateBody(registerSchema), register);
router.post('/login', authRateLimiter, validateBody(loginSchema), login);
router.post('/refresh', authRateLimiter, validateBody(refreshSchema), refresh);
router.post('/logout', authenticate, authRateLimiter, logout);
router.get('/me', authenticate, me);

export default router;
