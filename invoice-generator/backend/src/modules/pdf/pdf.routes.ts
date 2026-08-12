import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth';
import { validateParams } from '../../middleware/validate';
import { downloadInvoicePdf } from './pdf.controller';

const idParamSchema = z.object({ id: z.string().uuid() });

const router = Router();

router.use(authenticate);

router.get('/:id', validateParams(idParamSchema), downloadInvoicePdf);

export default router;
