import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { booksService } from './books.service';

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await booksService.list({
    page: parseInt(req.query.page as string, 10) || 1,
    limit: parseInt(req.query.limit as string, 10) || 10,
    search: req.query.search as string | undefined,
    genre: req.query.genre as string | undefined,
    categoryId: req.query.categoryId as string | undefined,
    sortBy: (req.query.sortBy as string) || 'createdAt',
    sortOrder: (req.query.sortOrder as string) || 'desc',
  });
  res.json(result);
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const book = await booksService.getById(req.params.id);
  res.json(book);
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const book = await booksService.create(req.body);
  res.status(201).json(book);
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const book = await booksService.update(req.params.id, req.body);
  res.json(book);
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await booksService.delete(req.params.id);
  res.status(204).send();
});
