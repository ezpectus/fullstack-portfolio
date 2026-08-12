import { Request, Response } from 'express';
import { notesService } from './notes.service';
import { asyncHandler } from '../../middleware/asyncHandler';

export class NotesController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await notesService.list({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      customerId: req.query.customerId as string | undefined,
      dealId: req.query.dealId as string | undefined,
      isPinned: req.query.isPinned as boolean | undefined,
      user: req.user!,
    });
    res.json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const note = await notesService.getById(req.params.id, req.user!);
    res.json({ data: note });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const note = await notesService.create(req.body, req.user!);
    res.status(201).json({ data: note, message: 'Note created successfully' });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const note = await notesService.update(req.params.id, req.body, req.user!);
    res.json({ data: note, message: 'Note updated successfully' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await notesService.delete(req.params.id, req.user!);
    res.status(204).send();
  });

  togglePin = asyncHandler(async (req: Request, res: Response) => {
    const note = await notesService.togglePin(req.params.id, req.user!);
    res.json({ data: note });
  });
}

export const notesController = new NotesController();
