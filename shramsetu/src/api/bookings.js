import { apiFetch, readTable, writeTable, delay } from './client.js';

const STORAGE_KEY = 'ss_bookings';

export const listBookings = async () => {
  try {
    const res = await apiFetch('/bookings', { method: 'GET' });
    if (res.success && Array.isArray(res.data)) {
      writeTable(STORAGE_KEY, res.data);
      return res.data;
    }
    return res;
  } catch {
    await delay();
    return readTable(STORAGE_KEY, []);
  }
};

export const createBooking = async (payload) => {
  try {
    const res = await apiFetch('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.success && res.data) {
      const current = readTable(STORAGE_KEY, []);
      writeTable(STORAGE_KEY, [res.data, ...current]);
      return res.data;
    }
    return res;
  } catch {
    await delay();
    const current = readTable(STORAGE_KEY, []);
    const newBooking = {
      id: Date.now(),
      ...payload,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    writeTable(STORAGE_KEY, [newBooking, ...current]);
    return newBooking;
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const res = await apiFetch(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    if (res.success && res.data) {
      const current = readTable(STORAGE_KEY, []);
      const updated = current.map((b) => (b.id === id ? { ...b, status } : b));
      writeTable(STORAGE_KEY, updated);
      return res.data;
    }
    return res;
  } catch {
    await delay();
    const current = readTable(STORAGE_KEY, []);
    const updated = current.map((b) => (b.id === id ? { ...b, status } : b));
    writeTable(STORAGE_KEY, updated);
    return updated.find((b) => b.id === id) || null;
  }
};