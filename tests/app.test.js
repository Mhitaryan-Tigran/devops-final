const request = require('supertest')
const { Client } = require('pg')
const { handle, server } = require('../src/app')

test('GET / returns the project name', async () => {
  const [status, , body] = await handle('GET', '/')
  expect(status).toBe(200)
  expect(body).toBe('DevOps Final Project')
})

test('GET /health returns status ok', async () => {
  const res = await request(server).get('/health')
  expect(res.status).toBe(200)
  expect(res.body).toEqual({ status: 'ok' })
})

test('GET /metrics exposes default metrics and the request counter', async () => {
  await request(server).get('/')
  const res = await request(server).get('/metrics')
  expect(res.text).toMatch(/process_resident_memory_bytes/)
  expect(res.text).toMatch(/http_requests_total\{method="GET",route="\/",status="200"\} \d+/)
})

const withDb = process.env.DATABASE_URL ? test : test.skip

withDb('the postgres service container is reachable', async () => {
  const db = new Client({ connectionString: process.env.DATABASE_URL })
  await db.connect()
  const { rows } = await db.query('SELECT 1 AS ok')
  await db.end()
  expect(rows[0].ok).toBe(1)
})
