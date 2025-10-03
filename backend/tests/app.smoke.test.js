import request from 'supertest';
import app from '../src/app.js';

describe('API smoke', () => {
  it('GET /api/products should return list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);
  });
});

