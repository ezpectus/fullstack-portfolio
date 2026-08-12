import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import { listInvoices, getInvoice, createInvoice, updateInvoice, updateInvoiceStatus, deleteInvoice } from './invoices.controller';
import { createInvoiceSchema, updateInvoiceSchema, invoiceStatusSchema, invoicePaginationSchema } from './invoices.dto';

const idParamSchema = z.object({ id: z.string().uuid() });

const router = Router();

router.use(authenticate);

router.get('/', validateQuery(invoicePaginationSchema), listInvoices);
router.get('/:id', validateParams(idParamSchema), getInvoice);
router.post('/', validateBody(createInvoiceSchema), createInvoice);
router.patch('/:id', validateParams(idParamSchema), validateBody(updateInvoiceSchema), updateInvoice);
router.patch('/:id/status', validateParams(idParamSchema), validateBody(invoiceStatusSchema), updateInvoiceStatus);
router.delete('/:id', validateParams(idParamSchema), deleteInvoice);

export { router as invoicesRoutes };
