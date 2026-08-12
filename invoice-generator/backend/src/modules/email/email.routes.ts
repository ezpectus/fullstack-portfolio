import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth';
import { validateParams } from '../../middleware/validate';
import { sendInvoiceEmail } from './email.controller';

const idParamSchema = z.object({ id: z.string().uuid() });

const router = Router();

router.use(authenticate);

router.post('/:id/send', validateParams(idParamSchema), sendInvoiceEmail);

export default router;
