import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import express from 'express';
import MockNewItem from '../mocks/MockNewItem.js';
import createTestRouter4 from '../helpers/createTestRouter4.js';
/**
 * @fileoverview
 * Backend tests for item-related routes using Node.js `test` module.
 * Tests cover POST, PATCH, and DELETE endpoints for items, including successful creation, update, deletion, validation errors, and not-found scenarios.
 */
const app = express();
app.use(express.json());
app.use('/', createTestRouter4(MockNewItem));
/**
 * Test: POST /items
 * Should create a new item and return 201 with the saved item object
 */
test('POST /items should return 201 with saved item', async () => {
  const response = await request(app)
    .post('/items')
    .send({ name: 'chair', image: 'chair.jpg', categoryId: 'cat123', projectId: 'proj123' });

  assert.equal(response.status, 201);
  assert.equal(response.body._id, 'mockNew123');
});
/**
 * Test: POST /items
 * Should return 400 when item creation fails due to missing or invalid data
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
 * Should update an existing item and return 200 with updated object
 */
test('PATCH /items/:id should update item', async () => {
  const response = await request(app)
    .patch('/items/abc123')
    .send({ name: 'updated chair' });

  assert.equal(response.status, 200);
  assert.equal(response.body.name, 'updated chair');
});
/**
 * Test: PATCH /items/:id
 * Should return 404 if the item to update does not exist
 */
test('PATCH /items/:id should return 404 if not found', async () => {
  const response = await request(app)
    .patch('/items/missing')
    .send({ name: 'updated chair' });

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, {error: 'Item not found'});
});
/**
 * Test: DELETE /items/:id
 * Should delete an existing item and return 200 with a success message
 */
test('DELETE /items/:id should delete item', async () => {
  const response = await request(app)
    .delete('/items/abc123');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { message: 'Item deleted' });
});
/**
 * Test: DELETE /items/:id
 * Should return 404 if the item to delete does not exist
 */
test('DELETE /items/:id should return 404 if not found', async () => {
  const response = await request(app)
    .delete('/items/missing');

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'Item not found' });
});
