import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Books API', () => {
  it('GET /books without auth should return 401', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(401);
  });

  it('POST /books without auth should return 401', async () => {
    const res = await request(app).post('/api/books').send({ title: 'Test Book' });
    expect(res.status).toBe(401);
  });

  it('GET /books/:id without auth should return 401', async () => {
    const res = await request(app).get('/api/books/123');
    expect(res.status).toBe(401);
  });
});

describe('Loans API', () => {
  it('GET /loans without auth should return 401', async () => {
    const res = await request(app).get('/api/loans');
    expect(res.status).toBe(401);
  });

  it('PATCH /loans/:id/return without auth should return 401', async () => {
    const res = await request(app).patch('/api/loans/123/return');
    expect(res.status).toBe(401);
  });
});

describe('Fines API', () => {
  it('GET /fines without auth should return 401', async () => {
    const res = await request(app).get('/api/fines');
    expect(res.status).toBe(401);
  });
});

describe('Reservations API', () => {
  it('GET /reservations without auth should return 401', async () => {
    const res = await request(app).get('/api/reservations');
    expect(res.status).toBe(401);
  });
});

describe('Reports API', () => {
  it('GET /reports/member-activity without auth should return 401', async () => {
    const res = await request(app).get('/api/reports/member-activity');
    expect(res.status).toBe(401);
  });
});
