import request from 'supertest';
import app from '../../src/app';

describe('Products API', () => {
  it('GET /api/products without token should return 401', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(401);
  });

  it('POST /api/products without token should return 401', async () => {
    const res = await request(app).post('/api/products').send({ sku: 'TEST', name: 'Test' });
    expect(res.status).toBe(401);
  });

  it('GET /api/products/:id/stock without token should return 401', async () => {
    const res = await request(app).get('/api/products/123/stock');
    expect(res.status).toBe(401);
  });
});

describe('Categories API', () => {
  it('GET /api/categories without token should return 401', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(401);
  });
});

describe('Warehouses API', () => {
  it('GET /api/warehouses without token should return 401', async () => {
    const res = await request(app).get('/api/warehouses');
    expect(res.status).toBe(401);
  });
});

describe('Stock Movements API', () => {
  it('GET /api/stock-movements without token should return 401', async () => {
    const res = await request(app).get('/api/stock-movements');
    expect(res.status).toBe(401);
  });
});

describe('Suppliers API', () => {
  it('GET /api/suppliers without token should return 401', async () => {
    const res = await request(app).get('/api/suppliers');
    expect(res.status).toBe(401);
  });
});

describe('Purchase Orders API', () => {
  it('GET /api/purchase-orders without token should return 401', async () => {
    const res = await request(app).get('/api/purchase-orders');
    expect(res.status).toBe(401);
  });
});

describe('Export API', () => {
  it('GET /api/export/products without token should return 401', async () => {
    const res = await request(app).get('/api/export/products');
    expect(res.status).toBe(401);
  });

  it('GET /api/export/purchase-orders without token should return 401', async () => {
    const res = await request(app).get('/api/export/purchase-orders');
    expect(res.status).toBe(401);
  });
});
