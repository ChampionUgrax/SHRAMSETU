// src/api/bookings.js
//
// Future backend: REST resource `/api/bookings`
//   GET    /api/bookings?customerId=...   -> listBookings()
//   POST   /api/bookings                  -> createBooking(payload)
//   PATCH  /api/bookings/:id              -> updateBookingStatus(id, status)

import { delay, readTable, writeTable } from './client'

const KEY = 'ss_bookings'

const SEED = [
  { id: 'BK-4821', workerId: 'w2', workerName: 'Priya Sharma', service: 'Elderly Care (per visit)', date: 'Aug 18, 2026', time: '10:00 AM', address: 'Sector 12, Dwarka', amount: 400, status: 'Completed', payment: 'UPI', createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4 },
  { id: 'BK-4790', workerId: 'w3', workerName: 'Amit Verma', service: 'Leak Fixing', date: 'Aug 14, 2026', time: '4:00 PM', address: 'Malviya Nagar, Jaipur', amount: 220, status: 'Completed', payment: 'Cash', createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8 },
]

// GET /api/bookings
export async function listBookings() {
  await delay()
  return readTable(KEY, SEED)
}

// POST /api/bookings
export async function createBooking(payload) {
  await delay()
  const booking = {
    id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Confirmed',
    createdAt: Date.now(),
    ...payload,
  }
  const current = readTable(KEY, SEED)
  const next = [booking, ...current]
  writeTable(KEY, next)
  return booking
}

// PATCH /api/bookings/:id
export async function updateBookingStatus(id, status) {
  await delay()
  const current = readTable(KEY, SEED)
  const next = current.map((b) => (b.id === id ? { ...b, status } : b))
  writeTable(KEY, next)
  return next.find((b) => b.id === id)
}
