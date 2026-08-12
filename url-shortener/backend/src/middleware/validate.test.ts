import { describe, it, expect } from 'vitest';
import { validateBody, validateParams, validateQuery } from './validate';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../shared/errors';

const schema = z.object({ name: z.string().min(2) });

function createMockReq(body = {}, params = {}, query = {}): Partial<Request> {
  return { body, params, query };
}

function createMockRes(): Partial<Response> {
  return {};
}

function createMockNext(): { fn: NextFunction; calledWith: unknown[] } {
  const calledWith: unknown[] = [];
  const fn = ((arg: unknown) => { calledWith.push(arg); }) as unknown as NextFunction;
  return { fn, calledWith };
}

describe('validateBody', () => {
  it('should call next on valid input', () => {
    const req = createMockReq({ name: 'John' });
    const { fn } = createMockNext();
    const middleware = validateBody(schema);
    middleware(req as Request, createMockRes() as Response, fn);
    expect(req.body).toEqual({ name: 'John' });
  });

  it('should call next with BadRequestError on invalid input', () => {
    const req = createMockReq({ name: 'a' });
    const { fn, calledWith } = createMockNext();
    const middleware = validateBody(schema);
    middleware(req as Request, createMockRes() as Response, fn);
    expect(calledWith.length).toBe(1);
    expect(calledWith[0]).toBeInstanceOf(BadRequestError);
  });

  it('should call next with BadRequestError on missing field', () => {
    const req = createMockReq({});
    const { fn, calledWith } = createMockNext();
    const middleware = validateBody(schema);
    middleware(req as Request, createMockRes() as Response, fn);
    expect(calledWith.length).toBe(1);
    expect(calledWith[0]).toBeInstanceOf(BadRequestError);
  });
});

describe('validateParams', () => {
  it('should call next on valid params', () => {
    const paramSchema = z.object({ id: z.string().uuid() });
    const req = createMockReq({}, { id: '123e4567-e89b-12d3-a456-426614174000' });
    const { fn } = createMockNext();
    const middleware = validateParams(paramSchema);
    middleware(req as Request, createMockRes() as Response, fn);
    expect(req.params).toEqual({ id: '123e4567-e89b-12d3-a456-426614174000' });
  });

  it('should call next with BadRequestError on invalid params', () => {
    const paramSchema = z.object({ id: z.string().uuid() });
    const req = createMockReq({}, { id: 'not-a-uuid' });
    const { fn, calledWith } = createMockNext();
    const middleware = validateParams(paramSchema);
    middleware(req as Request, createMockRes() as Response, fn);
    expect(calledWith.length).toBe(1);
    expect(calledWith[0]).toBeInstanceOf(BadRequestError);
  });
});

describe('validateQuery', () => {
  it('should call next on valid query', () => {
    const querySchema = z.object({ page: z.string().optional() });
    const req = createMockReq({}, {}, { page: '1' });
    const { fn } = createMockNext();
    const middleware = validateQuery(querySchema);
    middleware(req as Request, createMockRes() as Response, fn);
    expect(req.query).toEqual({ page: '1' });
  });

  it('should call next with BadRequestError on invalid query', () => {
    const querySchema = z.object({ limit: z.string().min(1) });
    const req = createMockReq({}, {}, { limit: '' });
    const { fn, calledWith } = createMockNext();
    const middleware = validateQuery(querySchema);
    middleware(req as Request, createMockRes() as Response, fn);
    expect(calledWith.length).toBe(1);
    expect(calledWith[0]).toBeInstanceOf(BadRequestError);
  });
});
