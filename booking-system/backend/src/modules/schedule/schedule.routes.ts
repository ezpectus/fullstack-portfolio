import { Router } from 'express';
import { z } from 'zod';
import { getSchedule, getSlots, block, unblock } from './schedule.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateParams } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';

const router = Router();

const providerIdSchema = z.object({ providerId: z.string().uuid() });
const blockIdSchema = z.object({ id: z.string().uuid() });

router.use(authenticate);

router.get('/:providerId', requireRole(ROLES.ADMIN, ROLES.PROVIDER), validateParams(providerIdSchema), ...getSchedule);
router.get('/:providerId/slots', requireRole(ROLES.ADMIN, ROLES.PROVIDER), validateParams(providerIdSchema), ...getSlots);
router.post('/block', requireRole(ROLES.ADMIN, ROLES.PROVIDER), ...block);
router.delete('/block/:id', validateParams(blockIdSchema), requireRole(ROLES.ADMIN, ROLES.PROVIDER), ...unblock);

export default router;
