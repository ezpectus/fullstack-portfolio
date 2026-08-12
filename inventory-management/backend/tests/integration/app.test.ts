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
  it('POST /api/auth/register should validate input', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'invalid' });
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/login should validate input', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });
});

describe('Protected Routes', () => {
  it('GET /api/products without token should return 401', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(401);
  });

  it('GET /api/warehouses without token should return 401', async () => {
    const res = await request(app).get('/api/warehouses');
    expect(res.status).toBe(401);
  });

  it('GET /api/dashboard/metrics without token should return 401', async () => {
    const res = await request(app).get('/api/dashboard/metrics');
    expect(res.status).toBe(401);
  });
});

describe('Swagger', () => {
  it('GET /api-docs/ should return 200', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
  });
});

describe('404 Catch-all', () => {
  it('GET /api/nonexistent should return 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

describe('Logout', () => {
  it('POST /api/auth/logout without cookie should return 204', async () => {
    const res = await request(app).post('/api/auth/logout').send({});
    expect(res.status).toBe(204);
  });
});
