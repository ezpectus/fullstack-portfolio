import { Request, Response } from 'express';
import { warehouseService } from './warehouses.service';
import { createWarehouseSchema, updateWarehouseSchema } from './warehouses.dto';
import { validateBody } from '../../middleware/validate';
import { asyncHandler } from '../../middleware/asyncHandler';

export class WarehouseController {
  list = [asyncHandler(async (_req: Request, res: Response) => {
    const result = await warehouseService.list();
    res.json(result);
  })];

  getById = [asyncHandler(async (req: Request, res: Response) => {
    const result = await warehouseService.getById(req.params.id);
    res.json(result);
  })];

  create = [validateBody(createWarehouseSchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await warehouseService.create(req.body);
    res.status(201).json(result);
  })];

  update = [validateBody(updateWarehouseSchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await warehouseService.update(req.params.id, req.body);
    res.json(result);
  })];

  delete = [asyncHandler(async (req: Request, res: Response) => {
    await warehouseService.delete(req.params.id);
    res.status(204).send();
  })];

  getStock = [asyncHandler(async (req: Request, res: Response) => {
    const result = await warehouseService.getStockLevels(req.params.id);
    res.json(result);
  })];
}

export const warehouseController = new WarehouseController();
