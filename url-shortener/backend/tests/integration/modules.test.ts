import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Links Endpoints — Validation', () => {
  it('POST /api/links should return 401 without auth', async () => {
    const res = await request(app).post('/api/links').send({ originalUrl: 'https://example.com' });
    expect(res.status).toBe(401);
  });

  it('POST /api/links/bulk should return 401 without auth', async () => {
    const res = await request(app).post('/api/links/bulk').send({ urls: ['https://example.com'] });
    expect(res.status).toBe(401);
  });

  it('GET /api/links/:id should return 401 without auth', async () => {
    const res = await request(app).get('/api/links/123e4567-e89b-12d3-a456-426614174000');
    expect(res.status).toBe(401);
  });

  it('PUT /api/links/:id should return 401 without auth', async () => {
    const res = await request(app).put('/api/links/123e4567-e89b-12d3-a456-426614174000').send({ status: 'disabled' });
    expect(res.status).toBe(401);
  });

  it('DELETE /api/links/:id should return 401 without auth', async () => {
    const res = await request(app).delete('/api/links/123e4567-e89b-12d3-a456-426614174000');
    expect(res.status).toBe(401);
  });
});

describe('API Keys Endpoints — Validation', () => {
  it('GET /api/api-keys should return 401 without auth', async () => {
    const res = await request(app).get('/api/api-keys');
    expect(res.status).toBe(401);
  });

  it('POST /api/api-keys should return 401 without auth', async () => {
    const res = await request(app).post('/api/api-keys').send({ name: 'Test Key' });
    expect(res.status).toBe(401);
  });

  it('DELETE /api/api-keys/:id should return 401 without auth', async () => {
    const res = await request(app).delete('/api/api-keys/123e4567-e89b-12d3-a456-426614174000');
    expect(res.status).toBe(401);
  });
});

describe('Settings Endpoints — Validation', () => {
  it('GET /api/settings should return 401 without auth', async () => {
    const res = await request(app).get('/api/settings');
    expect(res.status).toBe(401);
  });

  it('PUT /api/settings should return 401 without auth', async () => {
    const res = await request(app).put('/api/settings').send({ codeLength: 8 });
    expect(res.status).toBe(401);
  });
});

describe('QR Endpoints — Validation', () => {
  it('GET /api/qr/:id should return 401 without auth', async () => {
    const res = await request(app).get('/api/qr/123e4567-e89b-12d3-a456-426614174000');
    expect(res.status).toBe(401);
  });

  it('GET /api/qr/:id/png should return 401 without auth', async () => {
    const res = await request(app).get('/api/qr/123e4567-e89b-12d3-a456-426614174000/png');
    expect(res.status).toBe(401);
  });

  it('GET /api/qr/:id/svg should return 401 without auth', async () => {
    const res = await request(app).get('/api/qr/123e4567-e89b-12d3-a456-426614174000/svg');
    expect(res.status).toBe(401);
  });
});

describe('Analytics Endpoints — Validation', () => {
  it('GET /api/analytics should return 401 without auth', async () => {
    const res = await request(app).get('/api/analytics');
    expect(res.status).toBe(401);
  });

  it('GET /api/analytics/:id should return 401 without auth', async () => {
    const res = await request(app).get('/api/analytics/123e4567-e89b-12d3-a456-426614174000');
    expect(res.status).toBe(401);
  });
});

describe('Dashboard Endpoints — Validation', () => {
  it('GET /api/dashboard should return 401 without auth', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.status).toBe(401);
  });
});

describe('Users Endpoints — Validation', () => {
  it('GET /api/users should return 401 without auth', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });
});

describe('Swagger Documentation', () => {
  it('GET /api-docs/ should return 200', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
  });
});
