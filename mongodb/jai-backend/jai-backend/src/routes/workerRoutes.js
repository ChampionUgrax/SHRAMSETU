import { Router } from 'express';
import Worker from '../models/Worker.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/workers/me -> logged-in worker's own profile (no workerId field)
router.get('/me', requireAuth, requireRole('worker'), async (req, res) => {
  const worker = await Worker.findById(req.user.id);
  if (!worker) return res.status(404).json({ message: 'Worker not found' });
  res.json(worker);
});

// PATCH /api/workers/me
router.patch('/me', requireAuth, requireRole('worker'), async (req, res) => {
  const { name, phone, skill, category, cooperative, experienceYears, pricePerVisit } = req.body;
  const worker = await Worker.findByIdAndUpdate(
    req.user.id,
    { name, phone, skill, category, cooperative, experienceYears, pricePerVisit },
    { new: true, runValidators: true }
  );
  if (!worker) return res.status(404).json({ message: 'Worker not found' });
  res.json(worker);
});

// GET /api/workers -> public directory for the marketplace/search page (Prince consumes this)
// Still no workerId in the response — customers never need to see it, only book by Mongo _id.
router.get('/', async (req, res) => {
  const workers = await Worker.find({ isActive: true, status: 'verified' });
  res.json(workers);
});

// GET /api/workers/:id -> single worker profile page (uses Mongo _id in the URL)
router.get('/:id', async (req, res) => {
  const worker = await Worker.findById(req.params.id);
  if (!worker) return res.status(404).json({ message: 'Worker not found' });
  res.json(worker);
});

export default router;
