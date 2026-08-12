import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, UnauthorizedError, ForbiddenError, BadRequestError, ConflictError } from './errors';

describe('AppError', () => {
  it('should set status code, code, and message', () => {
    const err = new AppError(400, 'TEST_ERROR', 'Test error');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('TEST_ERROR');
    expect(err.message).toBe('Test error');
  });

  it('should extend Error', () => {
    const err = new AppError(500, 'SERVER_ERROR', 'Server error');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('AppError');
  });
});

describe('NotFoundError', () => {
  it('should have 404 status and NOT_FOUND code', () => {
    const err = new NotFoundError('User');
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toContain('User');
  });
});

describe('UnauthorizedError', () => {
  it('should have 401 status', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
  });

  it('should accept custom message', () => {
    const err = new UnauthorizedError('Token expired');
    expect(err.message).toBe('Token expired');
  });
});

describe('ForbiddenError', () => {
  it('should have 403 status', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });
});

describe('BadRequestError', () => {
  it('should have 400 status', () => {
    const err = new BadRequestError('Invalid data');
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Invalid data');
  });
});

describe('ConflictError', () => {
  it('should have 409 status', () => {
    const err = new ConflictError('Email exists');
    expect(err.statusCode).toBe(409);
    expect(err.message).toBe('Email exists');
  });
});
