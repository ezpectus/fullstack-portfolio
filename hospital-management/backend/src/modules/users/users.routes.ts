import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { authenticate, } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody, validateQuery } from '../../middleware/validate';
import usersService from './users.service';
import { updateUserSchema, listUsersQuerySchema } from './users.dto';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = listUsersQuerySchema.parse(req.query);
  const result = await usersService.list(query);
  res.json(result);
}));

router.get('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await usersService.getById(req.params.id);
  res.json(user);
}));

router.patch('/:id', authenticate, authorize('ADMIN'), validateBody(updateUserSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await usersService.update(req.params.id, req.body);
  res.json(user);
}));

router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(async (req: AuthRequest, res: Response) => {
  await usersService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
