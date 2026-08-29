import { apiFetch, readTable, writeTable, delay } from './client.js';

const STORAGE_KEY = 'ss_admin_workers';

export const listWorkers = async () => {
  try {
    const res = await apiFetch('/admin/workers', { method: 'GET' });
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

export const verifyWorker = async (id) => {
  try {
    const res = await apiFetch(`/admin/workers/${id}/verify`, { method: 'PATCH' });
    if (res.success && res.data) {
      const current = readTable(STORAGE_KEY, []);
      const updated = current.map((w) => (w.id === id ? { ...w, verified: true } : w));
      writeTable(STORAGE_KEY, updated);
      return res.data;
    }
    return res;
  } catch {
    await delay();
    const current = readTable(STORAGE_KEY, []);
    const updated = current.map((w) => (w.id === id ? { ...w, verified: true } : w));
    writeTable(STORAGE_KEY, updated);
    return updated.find((w) => w.id === id);
  }
};

export const suspendWorker = async (id) => {
  try {
    const res = await apiFetch(`/admin/workers/${id}/suspend`, { method: 'PATCH' });
    if (res.success && res.data) {
      const current = readTable(STORAGE_KEY, []);
      const updated = current.map((w) => (w.id === id ? { ...w, verified: false, suspended: true } : w));
      writeTable(STORAGE_KEY, updated);
      return res.data;
    }
    return res;
  } catch {
    await delay();
    const current = readTable(STORAGE_KEY, []);
    const updated = current.map((w) => (w.id === id ? { ...w, verified: false, suspended: true } : w));
    writeTable(STORAGE_KEY, updated);
    return updated.find((w) => w.id === id);
  }
};