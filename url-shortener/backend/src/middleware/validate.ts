import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestError } from '../shared/errors';

export const validateBody = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(new BadRequestError('Validation failed'));
  }
  req.body = result.data;
  next();
};

export const validateParams = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    return next(new BadRequestError('Invalid parameters'));
  }
  next();
};

export const validateQuery = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    return next(new BadRequestError('Invalid query parameters'));
  }
  req.query = result.data;
  next();
};
