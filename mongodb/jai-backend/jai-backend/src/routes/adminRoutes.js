import { Router } from 'express';
import Customer from '../models/Customer.js';
import Worker from '../models/Worker.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Every route below requires a valid admin JWT.
router.use(requireAuth, requireRole('admin'));

// GET /api/admin/customers
// .select('+customerId') is what reveals the private id — ONLY this route does this.
router.get('/customers', async (req, res) => {
  const customers = await Customer.find().select('+customerId').sort({ customerId: 1 });
  res.json(customers);
});

// GET /api/admin/workers
router.get('/workers', async (req, res) => {
  const workers = await Worker.find().select('+workerId').sort({ workerId: 1 });
  res.json(workers);
});

// GET /api/admin/customers/:mongoId  -> one customer, full detail, id included
router.get('/customers/:mongoId', async (req, res) => {
  const customer = await Customer.findById(req.params.mongoId).select('+customerId');
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
});

// GET /api/admin/workers/:mongoId
router.get('/workers/:mongoId', async (req, res) => {
  const worker = await Worker.findById(req.params.mongoId).select('+workerId');
  if (!worker) return res.status(404).json({ message: 'Worker not found' });
  res.json(worker);
});

// PATCH /api/admin/workers/:mongoId/verify
router.patch('/workers/:mongoId/verify', async (req, res) => {
  const worker = await Worker.findByIdAndUpdate(
    req.params.mongoId,
    {
      status: 'verified',
      'verification.identityVerified': true,
      'verification.skillCertified': true,
      'verification.cooperativeVerified': true,
    },
    { new: true }
  ).select('+workerId');
  if (!worker) return res.status(404).json({ message: 'Worker not found' });
  res.json(worker);
});

// PATCH /api/admin/workers/:mongoId/suspend
router.patch('/workers/:mongoId/suspend', async (req, res) => {
  const worker = await Worker.findByIdAndUpdate(
    req.params.mongoId,
    { status: 'suspended' },
    { new: true }
  ).select('+workerId');
  if (!worker) return res.status(404).json({ message: 'Worker not found' });
  res.json(worker);
});

// GET /api/admin/overview -> quick KPI counts for the admin dashboard
router.get('/overview', async (req, res) => {
  const [totalCustomers, totalWorkers, verifiedWorkers] = await Promise.all([
    Customer.countDocuments(),
    Worker.countDocuments(),
    Worker.countDocuments({ status: 'verified' }),
  ]);
  res.json({ totalCustomers, totalWorkers, verifiedWorkers });
});

export default router;
