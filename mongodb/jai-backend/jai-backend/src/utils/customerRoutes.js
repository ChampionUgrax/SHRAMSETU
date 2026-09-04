import { Router } from 'express';
import Customer from '../models/Customer.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/customers/me  -> the logged-in customer's own profile (no customerId field)
router.get('/me', requireAuth, requireRole('customer'), async (req, res) => {
  const customer = await Customer.findById(req.user.id); // customerId excluded by schema default
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
});

// PATCH /api/customers/me
router.patch('/me', requireAuth, requireRole('customer'), async (req, res) => {
  const { name, phone, address } = req.body;
  const customer = await Customer.findByIdAndUpdate(
    req.user.id,
    { name, phone, address },
    { new: true, runValidators: true }
  );
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
});

export default router;
