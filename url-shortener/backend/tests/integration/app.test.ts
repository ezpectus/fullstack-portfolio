import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Health Check', () => {
  it('GET /health should return 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Auth Endpoints', () => {
  it('POST /api/auth/register should validate input', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'invalid', password: 'short', name: '' });
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/login should validate input', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: '', password: '' });
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/refresh should require refresh token', async () => {
    const res = await request(app).post('/api/auth/refresh').send({});
    expect(res.status).toBe(400);
  });
});

describe('Protected Endpoints — 401 without auth', () => {
  it('GET /api/links should return 401', async () => {
    const res = await request(app).get('/api/links');
    expect(res.status).toBe(401);
  });

  it('POST /api/links should return 401', async () => {
    const res = await request(app).post('/api/links').send({ originalUrl: 'https://example.com' });
    expect(res.status).toBe(401);
  });

  it('GET /api/dashboard should return 401', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.status).toBe(401);
  });

  it('GET /api/analytics should return 401', async () => {
    const res = await request(app).get('/api/analytics');
    expect(res.status).toBe(401);
  });

  it('GET /api/qr/:id should return 401', async () => {
    const res = await request(app).get('/api/qr/123e4567-e89b-12d3-a456-426614174000');
    expect(res.status).toBe(401);
  });

  it('GET /api/api-keys should return 401', async () => {
    const res = await request(app).get('/api/api-keys');
    expect(res.status).toBe(401);
  });

  it('GET /api/settings should return 401', async () => {
    const res = await request(app).get('/api/settings');
    expect(res.status).toBe(401);
  });

  it('GET /api/users should return 401', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });
});

describe('Redirect Endpoint', () => {
  it('GET /:code should return 404 for non-existent code', async () => {
    const res = await request(app).get('/nonexistentcode123');
    expect(res.status).toBe(404);
  });
});

describe('404 Catch-All', () => {
  it('GET /api/nonexistent should return 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
  });
});

describe('Logout Endpoint', () => {
  it('POST /api/auth/logout should require refresh token', async () => {
    const res = await request(app).post('/api/auth/logout').send({});
    expect(res.status).toBe(400);
  });
});
