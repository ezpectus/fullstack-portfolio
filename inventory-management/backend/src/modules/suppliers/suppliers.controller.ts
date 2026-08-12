import { Request, Response } from 'express';
import { supplierService } from './suppliers.service';
import { createSupplierSchema, updateSupplierSchema } from './suppliers.dto';
import { validateBody } from '../../middleware/validate';
import { asyncHandler } from '../../middleware/asyncHandler';

export class SupplierController {
  list = [asyncHandler(async (_req: Request, res: Response) => {
    const result = await supplierService.list();
    res.json(result);
  })];

  getById = [asyncHandler(async (req: Request, res: Response) => {
    const result = await supplierService.getById(req.params.id);
    res.json(result);
  })];

  create = [validateBody(createSupplierSchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await supplierService.create(req.body);
    res.status(201).json(result);
  })];

  update = [validateBody(updateSupplierSchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await supplierService.update(req.params.id, req.body);
    res.json(result);
  })];

  delete = [asyncHandler(async (req: Request, res: Response) => {
    await supplierService.delete(req.params.id);
    res.status(204).send();
  })];
}

export const supplierController = new SupplierController();
