import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError, ConflictError } from '../../src/shared/errors';

describe('Errors', () => {
  it('should create AppError with correct properties', () => {
    const err = new AppError(400, 'TEST', 'Test error', { field: 'value' });
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('TEST');
    expect(err.message).toBe('Test error');
    expect(err.details).toEqual({ field: 'value' });
  });

  it('should create NotFoundError', () => {
    const err = new NotFoundError('Product');
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('Product not found');
  });

  it('should create BadRequestError', () => {
    const err = new BadRequestError('Invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('BAD_REQUEST');
  });

  it('should create UnauthorizedError', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
  });

  it('should create ForbiddenError', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });

  it('should create ConflictError', () => {
    const err = new ConflictError('Duplicate');
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe('CONFLICT');
  });
});
