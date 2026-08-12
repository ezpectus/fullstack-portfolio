import { Request, Response } from 'express';
import { productService } from './products.service';
import { createProductSchema, updateProductSchema, productPaginationSchema } from './products.dto';
import type { ProductPaginationInput } from './products.dto';
import { validateBody, validateQuery } from '../../middleware/validate';
import { asyncHandler } from '../../middleware/asyncHandler';

export class ProductController {
  list = [validateQuery(productPaginationSchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await productService.list(req.query as unknown as ProductPaginationInput);
    res.json(result);
  })];

  getById = [asyncHandler(async (req: Request, res: Response) => {
    const result = await productService.getById(req.params.id);
    res.json(result);
  })];

  create = [validateBody(createProductSchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await productService.create(req.body);
    res.status(201).json(result);
  })];

  update = [validateBody(updateProductSchema), asyncHandler(async (req: Request, res: Response) => {
    const result = await productService.update(req.params.id, req.body);
    res.json(result);
  })];

  delete = [asyncHandler(async (req: Request, res: Response) => {
    await productService.delete(req.params.id);
    res.status(204).send();
  })];

  getStock = [asyncHandler(async (req: Request, res: Response) => {
    const result = await productService.getStockLevels(req.params.id);
    res.json(result);
  })];
}

export const productController = new ProductController();
