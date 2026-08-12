import { Request, Response } from 'express';
import { purchaseOrderService } from './purchase-orders.service';
import { createPurchaseOrderSchema, updatePurchaseOrderSchema, purchaseOrderPaginationSchema } from './purchase-orders.dto';
import type { PurchaseOrderPaginationInput } from './purchase-orders.dto';
import { validateBody, validateQuery } from '../../middleware/validate';
import { asyncHandler } from '../../middleware/asyncHandler';

export class PurchaseOrderController {
  list = [validateQuery(purchaseOrderPaginationSchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await purchaseOrderService.list(req.query as unknown as PurchaseOrderPaginationInput);
    res.json(result);
  })];

  getById = [asyncHandler(async (req: Request, res: Response) => {
    const result = await purchaseOrderService.getById(req.params.id);
    res.json(result);
  })];

  create = [validateBody(createPurchaseOrderSchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await purchaseOrderService.create(req.body, req.user!.userId);
    res.status(201).json(result);
  })];

  update = [validateBody(updatePurchaseOrderSchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await purchaseOrderService.update(req.params.id, req.body);
    res.json(result);
  })];

  send = [asyncHandler(async (req: Request, res: Response) => {
    const result = await purchaseOrderService.send(req.params.id);
    res.json(result);
  })];

  receive = [asyncHandler(async (req: Request, res: Response) => {
    const result = await purchaseOrderService.receive(req.params.id, req.user!.userId);
    res.json(result);
  })];

  delete = [asyncHandler(async (req: Request, res: Response) => {
    await purchaseOrderService.delete(req.params.id);
    res.status(204).send();
  })];
}

export const purchaseOrderController = new PurchaseOrderController();
