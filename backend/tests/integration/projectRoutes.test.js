import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import app from '../../server.js';
import Project from '../../models/Project.js';
import Category from '../../models/Category.js';
import ItemNew from '../../models/ItemNew.js';
/**
 * @fileoverview
 * Integration tests for Project API routes using Node.js `test` module and `fetch`.
 * Tests include:
 * - Creating, retrieving, updating, and deleting projects
 * - Enriched project retrieval with associated categories and items
 * - Ensuring database operations reflect project status changes
 */
let server;
const port = 3004;// using different ports for each integration test
/**
 * Before all tests:
 * - Connect to MongoDB
 * - Initialize collections
 * - Start HTTP server for testing endpoints
 */
test.before(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Project.init();
  await Category.init();
  await ItemNew.init();
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(port, resolve));
});
/**
 * Before each test:
 * Clear Project, Category, and ItemNew collections to ensure isolation
 */
test.beforeEach(async () => {
  await Project.deleteMany({});
  await Category.deleteMany({});
  await ItemNew.deleteMany({});
});
/**
 * After all tests:
 * Close MongoDB connection
 * Stop HTTP server
 */
test.after(async () => {
  await mongoose.connection.close();
  await new Promise((resolve) => server.close(resolve));
});
/**
 * Test: POST /api/projects
 * Should create a new project and return 201 with project data
 */
test('POST /api/projects creates a new project', async () => {
  const res = await fetch(`http://localhost:${port}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Project' })
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.name, 'Test Project');
});
/**
 * Test: GET /api/projects
 * Should return a list of projects with associated categories (enriched)
 */
test('GET /api/projects returns enriched projects', async () => {
  const project = await Project.create({ name: 'Enriched Project' });
  await Category.create({ categoryName: 'Furniture', projectId: project._id });

  const res = await fetch(`http://localhost:${port}/api/projects`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data));
  assert.ok(data.length > 0);
  assert.equal(data[0].name, 'Enriched Project');
});
/**
 * Test: PATCH /api/projects/:id/status
 * Should update project status
 * If project is closed, all associated items should be deleted
 */
test('PATCH /api/projects/:id/status updates project and deletes items if closed', async () => {
  const project = await Project.create({ name: 'Closable Project', status: 'open' });
  const category = await Category.create({ categoryName: 'Furniture' });

  await ItemNew.create({
    name: 'Chair',
    image: 'test.png',
    categoryId: category._id,
    projectId: project._id
  });

  const res = await fetch(`http://localhost:${port}/api/projects/${project._id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'closed' })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'closed');
  // verify that associated items were deleted
  const items = await ItemNew.find({ projectId: project._id });
  assert.equal(items.length, 0);
});
/**
 * Test: GET /api/projects/:id
 * Should return a specific project if found
 */

test('GET /api/projects/:id returns project if found', async () => {
  const project = await Project.create({ name: 'FindMe' });

  const res = await fetch(`http://localhost:${port}/api/projects/${project._id}`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.name, 'FindMe');
});
/**
 * Test: GET /api/projects/:id
 * Should return 404 if project does not exist
 */
test('GET /api/projects/:id returns 404 if not found', async () => {
  const fakeId = new mongoose.Types.ObjectId();

  const res = await fetch(`http://localhost:${port}/api/projects/${fakeId}`);
  assert.equal(res.status, 404);
  const data = await res.json();
  assert.deepEqual(data, { error: 'Project not found' });
});





