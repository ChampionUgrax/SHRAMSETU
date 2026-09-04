// src/api/adminWorkers.js
//
// Future backend: REST resource `/api/admin/workers`
//   GET   /api/admin/workers          -> listWorkers()
//   PATCH /api/admin/workers/:id      -> verifyWorker(id) / suspendWorker(id)

import { delay, readTable, writeTable } from './client'
import { ADMIN_WORKERS } from '../data/mockData'

const KEY = 'ss_admin_workers'

// GET /api/admin/workers
export async function listWorkers() {
  await delay()
  return readTable(KEY, ADMIN_WORKERS)
}

// PATCH /api/admin/workers/:id  { status: 'Active', verified: true }
export async function verifyWorker(id) {
  await delay()
  const current = readTable(KEY, ADMIN_WORKERS)
  const next = current.map((w) => (w.id === id ? { ...w, status: 'Active', verified: true } : w))
  writeTable(KEY, next)
  return next.find((w) => w.id === id)
}

// PATCH /api/admin/workers/:id  { status: 'Suspended' }
export async function suspendWorker(id) {
  await delay()
  const current = readTable(KEY, ADMIN_WORKERS)
  const next = current.map((w) => (w.id === id ? { ...w, status: 'Suspended' } : w))
  writeTable(KEY, next)
  return next.find((w) => w.id === id)
}
