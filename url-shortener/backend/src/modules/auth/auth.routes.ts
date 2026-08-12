import { Router } from 'express';
import { authController } from './auth.controller';
import { validateBody } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { authRateLimiter } from '../../middleware/rateLimit';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.dto';

const router = Router();

router.post('/register', authRateLimiter, validateBody(registerSchema), authController.register);
router.post('/login', authRateLimiter, validateBody(loginSchema), authController.login);
router.post('/refresh', authRateLimiter, validateBody(refreshTokenSchema), authController.refresh);
router.post('/logout', authenticate, validateBody(refreshTokenSchema), authController.logout);
router.get('/me', authenticate, authController.me);

export default router;
