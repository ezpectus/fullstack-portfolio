import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Health Check', () => {
  it('GET /api/health should return 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('Auth Routes', () => {
  it('POST /auth/register should validate input', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
  });

  it('POST /auth/login should validate input', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });
});

describe('Protected Routes', () => {
  it('GET /books without auth should return 401', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(401);
  });

  it('GET /members without auth should return 401', async () => {
    const res = await request(app).get('/api/members');
    expect(res.status).toBe(401);
  });

  it('GET /loans without auth should return 401', async () => {
    const res = await request(app).get('/api/loans');
    expect(res.status).toBe(401);
  });

  it('GET /dashboard without auth should return 401', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.status).toBe(401);
  });
});

describe('Swagger Docs', () => {
  it('GET /api/docs should return 200', async () => {
    const res = await request(app).get('/api/docs/');
    expect(res.status).toBe(200);
  });
});
