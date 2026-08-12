import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody, validateParams } from '../../middleware/validate';
import { z } from 'zod';
import { apiKeysService } from './api-keys.service';

const router = Router();

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
});

const idParamSchema = z.object({ id: z.string().uuid() });

router.use(authenticate);

router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const keys = await apiKeysService.list(req.user!.id);
  res.json(keys);
}));

router.post('/', validateBody(createKeySchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const apiKey = await apiKeysService.create(req.user!.id, req.body.name);
  res.status(201).json(apiKey);
}));

router.delete('/:id', validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await apiKeysService.delete(req.user!.id, req.params.id);
  res.json(result);
}));

export default router;
