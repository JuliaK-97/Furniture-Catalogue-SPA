import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import express from 'express';
import MockItemDetail from '../mocks/MockItemDetail.js';
import createTestRouter5 from '../helpers/createTestRouter5.js';
/**
 * @fileoverview
 * Backend tests for item-details routes using Node.js `test` module.
 * Covers GET and PUT endpoints for item details, including:
 * - fetching existing details
 * - handling not found
 * - assigning LOT numbers
 * - error handling
 */
const app = express();
app.use(express.json());
app.use('/', createTestRouter5(MockItemDetail));
/**
 * Test: GET /item-details/:itemId
 * Should return the item detail when found
 */
test('GET /item-details/:itemId should return detail if found', async () => {
  const response = await request(app).get('/item-details/abc123');
  assert.equal(response.status, 200);
  assert.equal(response.body.itemId, 'abc123');
});
/**
 * Test: GET /item-details/:itemId
 * Should return 404 if the item detail is not found
 */
test('GET /item-details/:itemId should return 404 if not found', async () => {
  const response = await request(app).get('/item-details/missing');
  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'Detail not found' });
});
/**
 * Test: PUT /item-details/:itemId
 * Should create or update an item detail and assign LOT-1 if no existing item with that lot number
 */
test('PUT /item-details/:itemId should assign LOT-1 if no existing', async () => {
  const response = await request(app)
    .put('/item-details/abc123')
    .send({ projectId: 'projEmpty' });

  assert.equal(response.status, 200);
  assert.equal(response.body.lotNumber, 'LOT-1');
});
/**
 * Test: PUT /item-details/:itemId
 * Should assign LOT-3 if two existing items already exist for the project
 */
test('PUT /item-details/:itemId should assign LOT-3 if two existing', async () => {
  const response = await request(app)
    .put('/item-details/abc123')
    .send({ projectId: 'projTwo' });

  assert.equal(response.status, 200);
  assert.equal(response.body.lotNumber, 'LOT-3');
});
/**
 * Test: PUT /item-details/:itemId
 * Should return 400 if update fails due to an error
 */
test('PUT /item-details/:itemId should return 400 on update error', async () => {
  const response = await request(app)
    .put('/item-details/error')
    .send({ projectId: 'proj123' });

  assert.equal(response.status, 400);
  assert.ok(response.body.error.includes('Update failed'));
});
