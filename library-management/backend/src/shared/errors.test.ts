import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, UnauthorizedError, ForbiddenError, BadRequestError, ConflictError } from './errors';

describe('shared/errors', () => {
  it('AppError sets properties correctly', () => {
    const err = new AppError(400, 'TEST', 'Test message', { foo: 'bar' });
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('TEST');
    expect(err.message).toBe('Test message');
    expect(err.details).toEqual({ foo: 'bar' });
    expect(err.name).toBe('AppError');
  });

  it('NotFoundError sets 404 and NOT_FOUND code', () => {
    const err = new NotFoundError('Book');
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('Book not found');
  });

  it('UnauthorizedError sets 401', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
  });

  it('ForbiddenError sets 403', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });

  it('BadRequestError sets 400', () => {
    const err = new BadRequestError('Invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('BAD_REQUEST');
    expect(err.message).toBe('Invalid input');
  });

  it('ConflictError sets 409', () => {
    const err = new ConflictError('Duplicate');
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe('CONFLICT');
    expect(err.message).toBe('Duplicate');
  });

  it('AppError is instance of Error', () => {
    const err = new AppError(500, 'ERR', 'fail');
    expect(err).toBeInstanceOf(Error);
  });
});
