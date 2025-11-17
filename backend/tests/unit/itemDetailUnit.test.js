import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import express from 'express';
import MockItemDetail from '../mocks/MockItemDetail.js';
import createTestRouter5 from '../helpers/createTestRouter5.js';

const app = express();
app.use(express.json());
app.use('/', createTestRouter5(MockItemDetail));

test('GET /item-details/:itemId should return detail if found', async () => {
  const response = await request(app).get('/item-details/abc123');
  assert.equal(response.status, 200);
  assert.equal(response.body.itemId, 'abc123');
});

test('GET /item-details/:itemId should return 404 if not found', async () => {
  const response = await request(app).get('/item-details/missing');
  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'Detail not found' });
});

test('PUT /item-details/:itemId should assign LOT-1 if no existing', async () => {
  const response = await request(app)
    .put('/item-details/abc123')
    .send({ projectId: 'projEmpty' });

  assert.equal(response.status, 200);
  assert.equal(response.body.lotNumber, 'LOT-1');
});

test('PUT /item-details/:itemId should assign LOT-3 if two existing', async () => {
  const response = await request(app)
    .put('/item-details/abc123')
    .send({ projectId: 'projTwo' });

  assert.equal(response.status, 200);
  assert.equal(response.body.lotNumber, 'LOT-3');
});

test('PUT /item-details/:itemId should return 400 on update error', async () => {
  const response = await request(app)
    .put('/item-details/error')
    .send({ projectId: 'proj123' });

  assert.equal(response.status, 400);
  assert.ok(response.body.error.includes('Update failed'));
});
