import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, UnauthorizedError, ForbiddenError, BadRequestError, ConflictError } from './errors';

describe('Shared Errors', () => {
  it('AppError should have correct properties', () => {
    const err = new AppError(400, 'TEST', 'test message', { field: 'value' });
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('TEST');
    expect(err.message).toBe('test message');
    expect(err.details).toEqual({ field: 'value' });
    expect(err.name).toBe('AppError');
  });

  it('NotFoundError should have 404 status', () => {
    const err = new NotFoundError('Product');
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('Product not found');
  });

  it('UnauthorizedError should have 401 status', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
  });

  it('ForbiddenError should have 403 status', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });

  it('BadRequestError should have 400 status', () => {
    const err = new BadRequestError('Invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('BAD_REQUEST');
  });

  it('ConflictError should have 409 status', () => {
    const err = new ConflictError('Duplicate SKU');
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe('CONFLICT');
  });
});
