import { Router } from 'express';
import { register, login, refresh, logout, me, invite } from './auth.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { authRateLimiter } from '../../middleware/rateLimit';
import { ROLES } from '../../shared/constants';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post('/register', authRateLimiter, ...register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
router.post('/login', authRateLimiter, ...login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
router.post('/refresh', authRateLimiter, ...refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 */
router.post('/logout', authenticate, ...logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 */
router.get('/me', authenticate, ...me);

/**
 * @swagger
 * /api/auth/invite:
 *   post:
 *     summary: Invite a new user (admin only)
 *     tags: [Auth]
 */
router.post('/invite', authenticate, authRateLimiter, requireRole(ROLES.ADMIN), ...invite);

export default router;
