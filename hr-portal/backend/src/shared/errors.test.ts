import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError, ConflictError } from './errors';

describe('AppError', () => {
  it('creates an error with message and status code', () => {
    const err = new AppError(500, 'INTERNAL_ERROR', 'Something went wrong');
    expect(err.message).toBe('Something went wrong');
    expect(err.statusCode).toBe(500);
  });

  it('creates an error with custom status code', () => {
    const err = new AppError(404, 'NOT_FOUND', 'Not found');
    expect(err.message).toBe('Not found');
    expect(err.statusCode).toBe(404);
  });

  it('is an instance of Error', () => {
    const err = new AppError(400, 'BAD_REQUEST', 'Test');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('NotFoundError', () => {
  it('creates a 404 error with resource name', () => {
    const err = new NotFoundError('User');
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('User not found');
  });
});

describe('BadRequestError', () => {
  it('creates a 400 error', () => {
    const err = new BadRequestError('Invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('BAD_REQUEST');
  });
});

describe('UnauthorizedError', () => {
  it('creates a 401 error', () => {
    const err = new UnauthorizedError('Unauthorized');
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
  });
});

describe('ForbiddenError', () => {
  it('creates a 403 error', () => {
    const err = new ForbiddenError('Forbidden');
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });
});

describe('ConflictError', () => {
  it('creates a 409 error', () => {
    const err = new ConflictError('Email already exists');
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe('CONFLICT');
  });
});
