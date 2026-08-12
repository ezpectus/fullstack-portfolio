import { Router } from 'express';
import { z } from 'zod';
import { getSchedule, getSlots, block, unblock } from './schedule.controller';
import { authenticate } from '../../middleware/auth';
import { validateParams } from '../../middleware/validate';

const router = Router();

const providerIdSchema = z.object({ providerId: z.string().uuid() });
const blockIdSchema = z.object({ id: z.string().uuid() });

router.use(authenticate);

router.get('/:providerId', validateParams(providerIdSchema), ...getSchedule);
router.get('/:providerId/slots', validateParams(providerIdSchema), ...getSlots);
router.post('/block', ...block);
router.delete('/block/:id', validateParams(blockIdSchema), ...unblock);

export default router;
