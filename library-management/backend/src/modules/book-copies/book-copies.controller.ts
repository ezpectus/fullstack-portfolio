import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { bookCopiesService } from './book-copies.service';

import { BookCopyStatus } from '@prisma/client';

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await bookCopiesService.list({
    page: parseInt(req.query.page as string, 10) || 1,
    limit: parseInt(req.query.limit as string, 10) || 10,
    bookId: req.query.bookId as string | undefined,
    status: req.query.status as BookCopyStatus | undefined,
  });
  res.json(result);
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const copy = await bookCopiesService.getById(req.params.id);
  res.json(copy);
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const copy = await bookCopiesService.create(req.body);
  res.status(201).json(copy);
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const copy = await bookCopiesService.update(req.params.id, req.body);
  res.json(copy);
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await bookCopiesService.delete(req.params.id);
  res.status(204).send();
});
