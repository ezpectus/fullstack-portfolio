import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, UnauthorizedError, ForbiddenError, BadRequestError, ConflictError } from '../shared/errors';

describe('shared/errors', () => {
  describe('AppError', () => {
    it('creates an error with statusCode, code, and message', () => {
      const err = new AppError(400, 'CUSTOM', 'Something went wrong');
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('CUSTOM');
      expect(err.message).toBe('Something went wrong');
      expect(err.name).toBe('AppError');
      expect(err instanceof Error).toBe(true);
    });

    it('accepts optional details', () => {
      const err = new AppError(422, 'VALIDATION', 'Invalid input', { field: 'email' });
      expect(err.details).toEqual({ field: 'email' });
    });
  });

  describe('NotFoundError', () => {
    it('creates a 404 error with resource name', () => {
      const err = new NotFoundError('Product');
      expect(err.statusCode).toBe(404);
      expect(err.code).toBe('NOT_FOUND');
      expect(err.message).toBe('Product not found');
    });
  });

  describe('UnauthorizedError', () => {
    it('creates a 401 error with default message', () => {
      const err = new UnauthorizedError();
      expect(err.statusCode).toBe(401);
      expect(err.code).toBe('UNAUTHORIZED');
      expect(err.message).toBe('Unauthorized');
    });

    it('accepts a custom message', () => {
      const err = new UnauthorizedError('Token expired');
      expect(err.message).toBe('Token expired');
    });
  });

  describe('ForbiddenError', () => {
    it('creates a 403 error with default message', () => {
      const err = new ForbiddenError();
      expect(err.statusCode).toBe(403);
      expect(err.code).toBe('FORBIDDEN');
      expect(err.message).toBe('Forbidden');
    });
  });

  describe('BadRequestError', () => {
    it('creates a 400 error with custom message', () => {
      const err = new BadRequestError('Invalid email format');
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('BAD_REQUEST');
      expect(err.message).toBe('Invalid email format');
    });
  });

  describe('ConflictError', () => {
    it('creates a 409 error with custom message', () => {
      const err = new ConflictError('SKU already exists');
      expect(err.statusCode).toBe(409);
      expect(err.code).toBe('CONFLICT');
      expect(err.message).toBe('SKU already exists');
    });
  });
});
