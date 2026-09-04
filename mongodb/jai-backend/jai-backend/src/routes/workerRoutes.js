import { Router } from 'express';
import Worker from '../models/Worker.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/workers/me -> logged-in worker's own profile
router.get('/me', requireAuth, requireRole('worker'), async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.user.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/workers/me -> update logged-in worker's profile
router.patch('/me', requireAuth, requireRole('worker'), async (req, res, next) => {
  try {
    const { name, phone, skill, category, cooperative, experienceYears, pricePerVisit } = req.body;
    const worker = await Worker.findByIdAndUpdate(
      req.user.id,
      { name, phone, skill, category, cooperative, experienceYears, pricePerVisit },
      { new: true, runValidators: true }
    );
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (error) {
    next(error);
  }
});

// GET /api/workers -> public directory for marketplace
router.get('/', async (req, res, next) => {
  try {
    // 1. Query MongoDB for all workers
    let workers = await Worker.find({});

    // 2. Fallback sample data if MongoDB has 0 workers saved
    if (!workers || workers.length === 0) {
      workers = [
        {
          _id: "650000000000000000000001",
          name: "Ramesh Kumar",
          skill: "Electrician",
          category: "Electrical",
          experienceYears: 5,
          pricePerVisit: 300,
          status: "verified",
          isActive: true
        },
        {
          _id: "650000000000000000000002",
          name: "Suresh Sharma",
          skill: "Plumber",
          category: "Plumbing",
          experienceYears: 7,
          pricePerVisit: 400,
          status: "verified",
          isActive: true
        }
      ];
    }

    res.json(workers);
  } catch (error) {
    next(error);
  }
});

// GET /api/workers/:id -> single worker profile
router.get('/:id', async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (error) {
    next(error);
  }
});

export default router;