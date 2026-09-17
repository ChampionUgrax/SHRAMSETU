// src/api/adminWorkers.js

const API_URL = import.meta.env.VITE_API_URL

export async function listWorkers() {
  try {
    const response = await fetch(`${API_URL}/workers`)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch workers')
    }

    return data.workers
  } catch (error) {
    console.error('Error fetching workers:', error)
    throw error
  }
}