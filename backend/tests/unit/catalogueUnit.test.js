import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import express from 'express';
import MockCatalogue from '../mocks/MockCatalogue.js';
import createTestRouter6 from '../helpers/createTestRouter6.js';
/**
 * @fileoverview
 * Backend tests for catalogue routes using Node.js `test` module.
 * Covers POST, GET, and DELETE endpoints for catalogues, including:
 * - creating new catalogue entries
 * - validation error handling
 * - merging items with details
 * - deleting catalogue items
 * - handling not found errors
 */
const app = express();
app.use(express.json());
app.use('/', createTestRouter6(MockCatalogue));
/**
 * Test: POST /catalogues
 * Should create a new catalogue entry and return 201 with saved data
 */
test('POST /catalogues should return 201 with saved catalogue', async () => {
  const response = await request(app)
    .post('/catalogues')
    .send({ name: 'Spring Auction' });

  assert.equal(response.status, 201);
  assert.equal(response.body._id, 'mockCat123');
});
/**
 * Test: POST /catalogues
 * Should return 400 if validation fails (missing required fields)
 */
test('POST /catalogues should return 400 on validation error', async () => {
  const response = await request(app)
    .post('/catalogues')
    .send({}); 

  assert.equal(response.status, 400);
  assert.ok(response.body.error.includes('Catalogue name is required'));
});
/**
 * Test: GET /catalogue/:projectId
 * Should return merged items and item details for a given project
 */
test('GET /catalogue/:projectId should merge items and details', async () => {
  const response = await request(app).get('/catalogue/proj123');
  assert.equal(response.status, 200);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].lotNumber, 'LOT-1');
  assert.equal(response.body[1].condition, 'Fair');
});
/**
 * Test: DELETE /catalogue/:itemId
 * Should delete an existing catalogue item successfully
 */
test('DELETE /catalogue/:itemId should delete item successfully', async () => {
  const response = await request(app).delete('/catalogue/item1');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { message: 'Item deleted successfully' });
});
/**
 * Test: DELETE /catalogue/:itemId
 * Should return 404 if the item to delete is not found
 */
test('DELETE /catalogue/:itemId should return 404 if not found', async () => {
  const response = await request(app).delete('/catalogue/missing');
  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'Item not found' });
});
