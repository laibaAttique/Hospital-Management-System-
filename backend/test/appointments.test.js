const request = require('supertest');
const app = require('../server');

let authToken = '';

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'admin123' });

  authToken = res.body.token;
});

describe('Appointments API Tests', () => {
  test('GET /api/appointments - returns list with valid token', async () => {
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', 'Bearer ' + authToken);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/appointments - fails without token', async () => {
    const res = await request(app)
      .get('/api/appointments');

    expect(res.statusCode).toBe(403);
  });
});