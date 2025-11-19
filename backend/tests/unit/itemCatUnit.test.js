import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import express from 'express';
import MockItemCat from '../mocks/MockItemCat.js';
import createTestRouter3 from '../helpers/createTestRouter3.js';
/**
 * @fileoverview
 * Backend tests for itemCats routes using Node.js `test` module.
 * Covers POST, PATCH, and DELETE endpoints for item categories, including:
 * - creating new items
 * - validation error handling
 * - updating existing items
 * - deleting items
 * - handling not found errors
 */
const app = express();
app.use(express.json());
app.use('/', createTestRouter3(MockItemCat));
/**
 * Test: POST /items
 * Should create a new item and return 201 with the saved item
 */
test('POST /items should return 201 with saved item', async () => {
  const response = await request(app)
    .post('/items')
    .send({ name: 'desk', image: 'desk.jpg', categoryId: 'cat123', projectId: 'proj123' });

  assert.equal(response.status, 201);
  assert.equal(response.body._id, 'mockItem123');
});
/**
 * Test: POST /items
 * Should return 400 if saving the item fails due to validation error
 */
test('POST /items should return 400 on save error', async () => {
  const response = await request(app)
    .post('/items')
    .send({ name: 'fail' });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, { error: 'Item name is required' });
});
/**
 * Test: PATCH /items/:id
 * Should update an existing item and return 200 with the updated data
 */
test('PATCH /items/:id should update item', async () => {
  const response = await request(app)
    .patch('/items/abc123')
    .send({ name: 'updated desk' });

  assert.equal(response.status, 200);
  assert.equal(response.body.name, 'updated desk');
});
/**
 * Test: PATCH /items/:id
 * Should return 404 if the item to update is not found
 */
test('PATCH /items/:id should return 404 if not found', async () => {
  const response = await request(app)
    .patch('/items/missing')
    .send({ name: 'updated desk' });

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'Item not found' });
});
/**
 * Test: DELETE /items/:id
 * Should delete an existing item and return 200 with a confirmation message
 */
test('DELETE /items/:id should delete item', async () => {
  const response = await request(app)
    .delete('/items/abc123');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { message: 'Item deleted' });
});
/**
 * Test: DELETE /items/:id
 * Should return 404 if the item to delete is not found
 */
test('DELETE /items/:id should return 404 if not found', async () => {
  const response = await request(app)
    .delete('/items/missing');

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'Item not found' });
});
