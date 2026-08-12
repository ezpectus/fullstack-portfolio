import { Request, Response } from 'express';
import { stockMovementService } from './stock-movements.service';
import { createMovementSchema, movementPaginationSchema } from './stock-movements.dto';
import type { MovementPaginationInput } from './stock-movements.dto';
import { validateBody, validateQuery } from '../../middleware/validate';
import { asyncHandler } from '../../middleware/asyncHandler';

export class StockMovementController {
  list = [validateQuery(movementPaginationSchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await stockMovementService.list(req.query as unknown as MovementPaginationInput);
    res.json(result);
  })];

  create = [validateBody(createMovementSchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await stockMovementService.create(req.body, req.user!.userId);
    res.status(201).json(result);
  })];
}

export const stockMovementController = new StockMovementController();
