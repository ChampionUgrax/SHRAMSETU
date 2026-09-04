import { Router } from 'express';
import Worker from '../models/Worker.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/workers/me -> logged-in worker's own profile
router.get('/me', requireAuth, requireRole('worker'), async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.user.id);
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
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
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json(worker);
  } catch (error) {
    next(error);
  }
});

// GET /api/workers -> public directory for marketplace & search
router.get('/', async (req, res, next) => {
  try {
    // Attempt to fetch active & verified workers
    let workers = await Worker.find({ isActive: true, status: 'verified' });
    
    // Fallback: If no verified workers match, fetch all registered workers to prevent empty UI screens
    if (!workers || workers.length === 0) {
      workers = await Worker.find({});
    }

    res.json(workers);
  } catch (error) {
    next(error);
  }
});

// GET /api/workers/:id -> single worker profile by Mongo _id
router.get('/:id', async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json(worker);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid worker ID format' });
    }
    next(error);
  }
});

export default router;