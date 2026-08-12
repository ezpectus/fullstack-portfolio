import { Router } from 'express';
import { z } from 'zod';
import usersService from './users.service';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import { updateUserSchema, listUsersSchema } from './users.dto';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, authorize('HR_ADMIN'), validateQuery(listUsersSchema), asyncHandler(async (req, res) => {
  const result = await usersService.list(req.query as Record<string, string>);
  res.json(result);
}));

router.get('/:id', authenticate, authorize('HR_ADMIN'), validateParams(idParamSchema), asyncHandler(async (req, res) => {
  const user = await usersService.getById(req.params.id);
  res.json(user);
}));

router.patch('/:id', authenticate, authorize('HR_ADMIN'), validateParams(idParamSchema), validateBody(updateUserSchema), asyncHandler(async (req, res) => {
  const user = await usersService.update(req.params.id, req.body);
  res.json(user);
}));

router.delete('/:id', authenticate, authorize('HR_ADMIN'), validateParams(idParamSchema), asyncHandler(async (req, res) => {
  await usersService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
