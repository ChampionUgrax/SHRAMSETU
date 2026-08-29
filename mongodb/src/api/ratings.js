// src/api/ratings.js
//
// Future backend: REST resource `/api/ratings`
//   GET  /api/ratings?workerId=...   -> listRatings()
//   POST /api/ratings                -> submitRating(payload)

import { delay, readTable, writeTable } from './client'

const KEY = 'ss_ratings'

// GET /api/ratings
export async function listRatings() {
  await delay()
  return readTable(KEY, [])
}

// POST /api/ratings
export async function submitRating({ bookingId, worker, rating, review }) {
  await delay()
  const current = readTable(KEY, [])
  const entry = { bookingId, worker, rating, review, date: Date.now() }
  writeTable(KEY, [...current, entry])
  return entry
}
