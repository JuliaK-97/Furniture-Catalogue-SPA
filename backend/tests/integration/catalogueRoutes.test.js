import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'http'
import fetch from 'node-fetch'
import mongoose from 'mongoose'
import app from '../../server.js'
import Catalogue from '../../models/Catalogue.js'
import ItemNew from '../../models/ItemNew.js'
import ItemDetail from '../../models/ItemDetail.js'
import Category from '../../models/Category.js'
import Project from '../../models/Project.js'

let server
const port = 3008

test.before(async () => {
  await mongoose.connect(process.env.MONGO_URI)
  await Catalogue.init()
  await ItemNew.init()
  await ItemDetail.init()
  await Category.init()
  await Project.init()
  server = http.createServer(app)
  await new Promise(resolve => server.listen(port, resolve))
})

test.beforeEach(async () => {
  await Catalogue.deleteMany({})
  await ItemNew.deleteMany({})
  await ItemDetail.deleteMany({})
  await Category.deleteMany({})
  await Project.deleteMany({})
})

test.after(async () => {
  await mongoose.connection.close()
  await new Promise(resolve => server.close(resolve))
})

test('POST /api/catalogues creates a new catalogue', async () => {
  const res = await fetch(`http://localhost:${port}/api/catalogues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectName: 'Catalogue A', createdBy: 'Tester' })
  })
  assert.equal(res.status, 201)
  const data = await res.json()
  assert.equal(data.projectName, 'Catalogue A')
  assert.equal(data.createdBy, 'Tester')
})

test('GET /api/catalogues returns all catalogues', async () => {
  await Catalogue.create({ projectName: 'Catalogue B', createdBy: 'Tester' })
  const res = await fetch(`http://localhost:${port}/api/catalogues`)
  assert.equal(res.status, 200)
  const data = await res.json()
  assert.ok(Array.isArray(data))
  assert.ok(data.length > 0)
})

test('GET /api/catalogues/:id returns catalogue if found', async () => {
  const cat = await Catalogue.create({ projectName: 'Catalogue C', createdBy: 'Tester' })
  const res = await fetch(`http://localhost:${port}/api/catalogues/${cat._id}`)
  assert.equal(res.status, 200)
  const data = await res.json()
  assert.equal(data.projectName, 'Catalogue C')
  assert.equal(data.createdBy, 'Tester')
})

test('GET /api/catalogues/:id returns 404 if not found', async () => {
  const fakeId = new mongoose.Types.ObjectId()
  const res = await fetch(`http://localhost:${port}/api/catalogues/${fakeId}`)
  assert.equal(res.status, 404)
  const data = await res.json()
  assert.deepEqual(data, { error: 'Catalogue not found' })
})

test('GET /api/catalogue/:projectId returns merged items with details', async () => {
  const project = await Project.create({ name: 'Proj' })
  const category = await Category.create({ categoryName: 'Cat' })
  const item = await ItemNew.create({
    name: 'Chair',
    image: 'chair.png',
    projectId: project._id,
    categoryId: category._id
  })
  await ItemDetail.create({
    itemId: item._id,
    projectId: project._id,
    lotNumber: 'LOT-1',
    condition: 'Good'
  })

  const res = await fetch(`http://localhost:${port}/api/catalogue/${project._id}`)
  assert.equal(res.status, 200)
  const data = await res.json()
  assert.ok(Array.isArray(data))
  assert.equal(data[0].name, 'Chair')
  assert.equal(data[0].lotNumber, 'LOT-1')
  assert.equal(data[0].condition, 'Good')
})

test('DELETE /api/catalogue/:itemId deletes item and detail', async () => {
  const project = await Project.create({ name: 'Proj' })
  const category = await Category.create({ categoryName: 'Cat' })
  const item = await ItemNew.create({
    name: 'Table',
    image: 'table.png',
    projectId: project._id,
    categoryId: category._id
  })
  await ItemDetail.create({
    itemId: item._id,
    projectId: project._id,
    lotNumber: 'LOT-2',
    condition: 'Fair'
  })

  const res = await fetch(`http://localhost:${port}/api/catalogue/${item._id}`, {
    method: 'DELETE'
  })
  assert.equal(res.status, 200)
  const data = await res.json()
  assert.deepEqual(data, { message: 'Item deleted successfully' })

  const existsItem = await ItemNew.findById(item._id)
  const existsDetail = await ItemDetail.findOne({ itemId: item._id })
  assert.equal(existsItem, null)
  assert.equal(existsDetail, null)
})

