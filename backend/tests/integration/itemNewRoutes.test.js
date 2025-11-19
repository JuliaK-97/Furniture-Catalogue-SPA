import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'http'
import fetch from 'node-fetch'
import mongoose from 'mongoose'
import fs from 'fs'
import FormData from 'form-data'
import app from '../../server.js'
import ItemNew from '../../models/ItemNew.js'
import Project from '../../models/Project.js'
import Category from '../../models/Category.js'
/**
 * @fileoverview
 * Integration tests for ItemNew API routes, including:
 * - Creating items with image upload
 * - Fetching items
 * - Updating items
 * - Deleting items
 * Uses Node.js `test` module, `fetch`, and `FormData` for multipart/form-data requests.
 */
let server
const port = 3006
/**
 * Before all tests:
 * - Connect to MongoDB
 * - Initialize collections
 * - Start HTTP server
 */
test.before(async () => {
  await mongoose.connect(process.env.MONGO_URI)
  await ItemNew.init()
  await Project.init()
  await Category.init()
  server = http.createServer(app)
  await new Promise(resolve => server.listen(port, resolve))
})
/**
 * Before each test:
 * - Clear relevant collections for isolation
 */
test.beforeEach(async () => {
  await ItemNew.deleteMany({})
  await Project.deleteMany({})
  await Category.deleteMany({})
})
/**
 * After all tests:
 * - Close MongoDB connection
 * - Stop HTTP server
 */
test.after(async () => {
  await mongoose.connection.close()
  await new Promise(resolve => server.close(resolve))
})
/**
 * Test: POST /api/items
 * Creates a new item with an image upload
 * Uses multipart/form-data
 * Expects 201 response and uploaded image path
 */
test('POST /api/items creates a new item with image upload', async () => {
  const project = await Project.create({ name: 'Test Project' })
  const category = await Category.create({ categoryName: 'Test Category' })

  const form = new FormData()
  form.append('name', 'Chair')
  form.append('categoryId', category._id.toString())
  form.append('projectId', project._id.toString())
  form.append('image', fs.createReadStream('./tests/assets/dummy.png'))

  const res = await fetch(`http://localhost:${port}/api/items`, {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  })

  assert.equal(res.status, 201)
  const data = await res.json()
  assert.equal(data.name, 'Chair')
  assert.ok(data.image.includes('/uploads/'))
})
/**
 * Test: GET /api/items
 * Retrieves all items
 * Expects 200 response and array of items
 */
test('GET /api/items returns all items', async () => {
  const project = await Project.create({ name: 'Proj' })
  const category = await Category.create({ categoryName: 'Cat' })
  await ItemNew.create({ name: 'Desk', image: 'desk.png', projectId: project._id, categoryId: category._id })

  const res = await fetch(`http://localhost:${port}/api/items`)
  assert.equal(res.status, 200)
  const data = await res.json()
  assert.ok(Array.isArray(data))
  assert.ok(data.length > 0)
})
/**
 * Test: GET /api/items/:id
 * Retrieves a single item by ID
 * Expects 200 response and correct item data
 */
test('GET /api/items/:id returns item if found', async () => {
  const project = await Project.create({ name: 'Proj' })
  const category = await Category.create({ categoryName: 'Cat' })
  const item = await ItemNew.create({ name: 'Lamp', image: 'lamp.png', projectId: project._id, categoryId: category._id })

  const res = await fetch(`http://localhost:${port}/api/items/${item._id}`)
  assert.equal(res.status, 200)
  const data = await res.json()
  assert.equal(data.name, 'Lamp')
})
/**
 * Test: PATCH /api/items/:id
 * Updates item fields
 * Expects 200 response and updated data
 */
test('PATCH /api/items/:id updates item', async () => {
  const project = await Project.create({ name: 'Proj' })
  const category = await Category.create({ categoryName: 'Cat' })
  const item = await ItemNew.create({ name: 'Old', image: 'old.png', projectId: project._id, categoryId: category._id })

  const res = await fetch(`http://localhost:${port}/api/items/${item._id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'New' })
  })

  assert.equal(res.status, 200)
  const data = await res.json()
  assert.equal(data.name, 'New')
})
/**
 * Test: DELETE /api/items/:id
 * Deletes an item by ID
 * Expects 200 response and confirmation message
 * Ensures the item is removed from the database
 */
test('DELETE /api/items/:id deletes item', async () => {
  const project = await Project.create({ name: 'Proj' })
  const category = await Category.create({ categoryName: 'Cat' })
  const item = await ItemNew.create({ name: 'DeleteMe', image: 'del.png', projectId: project._id, categoryId: category._id })

  const res = await fetch(`http://localhost:${port}/api/items/${item._id}`, {
    method: 'DELETE'
  })

  assert.equal(res.status, 200)
  const data = await res.json()
  assert.deepEqual(data, { message: 'Item deleted' })

  const exists = await ItemNew.findById(item._id)
  assert.equal(exists, null)
})

