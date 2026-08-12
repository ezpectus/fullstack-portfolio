import { Response } from 'express';
import { apiKeysService } from './api-keys.service';
import { AuthRequest } from '../../middleware/auth';

export const apiKeysController = {
  list: async (req: AuthRequest, res: Response) => {
    const keys = await apiKeysService.list(req.user!.id);
    res.json({ data: keys });
  },

  create: async (req: AuthRequest, res: Response) => {
    const apiKey = await apiKeysService.create(req.user!.id, req.body.name);
    res.status(201).json(apiKey);
  },

  delete: async (req: AuthRequest, res: Response) => {
    const result = await apiKeysService.delete(req.user!.id, req.params.id);
    res.json(result);
  },
};
