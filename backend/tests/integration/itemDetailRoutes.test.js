import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'http'
import fetch from 'node-fetch'
import mongoose from 'mongoose'
import app from '../../server.js'
import ItemDetail from '../../models/ItemDetail.js'
import Project from '../../models/Project.js'
import ItemNew from '../../models/ItemNew.js'
import Category from '../../models/Category.js'

let server
const port = 3007
test.before(async () => {
  await mongoose.connect(process.env.MONGO_URI)
  await ItemDetail.init()
  await Project.init()
  await ItemNew.init()
  await Category.init()
  server = http.createServer(app)
  await new Promise(resolve => server.listen(port, resolve))
})

test.beforeEach(async () => {
  await ItemDetail.deleteMany({})
  await Project.deleteMany({})
  await ItemNew.deleteMany({})
  await Category.deleteMany({})
})

test.after(async () => {
  await mongoose.connection.close()
  await new Promise(resolve => server.close(resolve))
})


test('GET /api/item-details/:itemId returns detail if found', async () => {
  const project = await Project.create({ name: 'Proj' })
  const category = await Category.create({ categoryName: 'Test Category' })
  const item = await ItemNew.create({
    name: 'Chair',
    image: 'chair.png',
    projectId: project._id,
    categoryId: category._id
  })

  await ItemDetail.create({
    itemId: item._id.toString(),
    projectId: project._id,
    lotNumber: 'LOT-1',
    condition: 'Good'
  })

  const res = await fetch(`http://localhost:${port}/api/item-details/${item._id}`)
  assert.equal(res.status, 200)
  const data = await res.json()
  assert.equal(data.condition, 'Good')
  assert.equal(data.lotNumber, 'LOT-1')
})

test('GET /api/item-details/:itemId returns 404 if not found', async () => {
  const fakeId = new mongoose.Types.ObjectId()
  const res = await fetch(`http://localhost:${port}/api/item-details/${fakeId}`)
  assert.equal(res.status, 404)
  const data = await res.json()
  assert.deepEqual(data, { error: 'Detail not found' })
})

test('PUT /api/item-details/:itemId creates new detail with lot number', async () => {
  const project = await Project.create({ name: 'Proj' })
  const category = await Category.create({ categoryName: 'Test Category' })
  const item = await ItemNew.create({
    name: 'Desk',
    image: 'desk.png',
    projectId: project._id,
    categoryId: category._id
  })

  const res = await fetch(`http://localhost:${port}/api/item-details/${item._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId: project._id, condition: 'Fair' })
  })

  assert.equal(res.status, 200)
  const data = await res.json()
  assert.equal(data.condition, 'Fair')
  assert.ok(data.lotNumber.startsWith('LOT-'))
})

test('PUT /api/item-details/:itemId increments lot number per project', async () => {
  const project = await Project.create({ name: 'Proj' })
  const category = await Category.create({ categoryName: 'Test Category' })
  const item1 = await ItemNew.create({
    name: 'Lamp',
    image: 'lamp.png',
    projectId: project._id,
    categoryId: category._id
  })
  const item2 = await ItemNew.create({
    name: 'Table',
    image: 'table.png',
    projectId: project._id,
    categoryId: category._id
  })

  await fetch(`http://localhost:${port}/api/item-details/${item1._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId: project._id, condition: 'Poor' })
  })

  const res = await fetch(`http://localhost:${port}/api/item-details/${item2._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId: project._id, condition: 'Good' })
  })

  assert.equal(res.status, 200)
  const data = await res.json()
  assert.equal(data.lotNumber, 'LOT-2')
  assert.equal(data.condition, 'Good')
})


