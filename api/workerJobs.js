// src/api/workerJobs.js
//
// Future backend: REST resource `/api/worker-jobs`
//   GET   /api/worker-jobs            -> listJobs()
//   GET   /api/worker-jobs/:id        -> getJobById(id)
//   POST  /api/worker-jobs            -> createJobRequest(payload)
//   PATCH /api/worker-jobs/:id        -> updateJobStatus(id, status)
//
// This table is the single source of truth for the Booking-approval flow:
// a customer's booking request and a worker's "Job Requests" queue are the
// same records. Creating a request here is what makes it show up on the
// worker's dashboard; accepting/rejecting it there is what a polling
// customer screen picks up.

import { delay, readTable, writeTable } from './client'
import { JOB_REQUESTS } from '../data/mockauth'

const KEY = 'ss_worker_jobs'
const SEED = JOB_REQUESTS.map((j) => ({ ...j, status: 'Requested' }))

// GET /api/worker-jobs
export async function listJobs() {
  await delay()
  return readTable(KEY, SEED)
}

// GET /api/worker-jobs/:id — used for lightweight polling, shorter delay
export async function getJobById(id) {
  await delay(150)
  const current = readTable(KEY, SEED)
  return current.find((j) => j.id === id) || null
}

// POST /api/worker-jobs — a customer requesting a specific worker
export async function createJobRequest(payload) {
  await delay()
  const job = {
    id: `jr-${Date.now()}`,
    status: 'Requested',
    ...payload,
  }
  const current = readTable(KEY, SEED)
  writeTable(KEY, [job, ...current])
  return job
}

// PATCH /api/worker-jobs/:id
export async function updateJobStatus(id, status) {
  await delay()
  const current = readTable(KEY, SEED)
  const next = current.map((j) => (j.id === id ? { ...j, status } : j))
  writeTable(KEY, next)
  return next.find((j) => j.id === id)
}
