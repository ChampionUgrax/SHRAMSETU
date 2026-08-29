// src/api/notifications.js
//
// Future backend: REST resource `/api/notifications`
//   GET   /api/notifications          -> listNotifications()
//   PATCH /api/notifications/read-all -> markAllRead()

import { delay, readTable, writeTable } from './client'
import { DEFAULT_NOTIFICATIONS } from '../data/mockData'

const KEY = 'ss_notifications'

// GET /api/notifications
export async function listNotifications() {
  await delay()
  return readTable(KEY, DEFAULT_NOTIFICATIONS)
}

// PATCH /api/notifications/read-all
export async function markAllRead() {
  await delay()
  const current = readTable(KEY, DEFAULT_NOTIFICATIONS)
  const next = current.map((n) => ({ ...n, read: true }))
  writeTable(KEY, next)
  return next
}
