import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import { z } from 'zod';
import { listClients, getClient, getClientBalance, createClient, updateClient, deleteClient } from './clients.controller';
import { createClientSchema, updateClientSchema, clientPaginationSchema } from './clients.dto';

const idParamSchema = z.object({ id: z.string().uuid() });

const router = Router();

router.use(authenticate);

router.get('/', validateQuery(clientPaginationSchema), listClients);
router.get('/:id', validateParams(idParamSchema), getClient);
router.get('/:id/balance', validateParams(idParamSchema), getClientBalance);
router.post('/', validateBody(createClientSchema), createClient);
router.patch('/:id', validateParams(idParamSchema), validateBody(updateClientSchema), updateClient);
router.delete('/:id', validateParams(idParamSchema), deleteClient);

export { router as clientsRoutes };
