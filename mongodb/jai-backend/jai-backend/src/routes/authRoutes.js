import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.js';
import Worker from '../models/Worker.js';
import Admin from '../models/Admin.js';
import { getNextSequence } from '../utils/generateId.js';

const router = Router();

function signToken(user, role) {
  // Only the Mongo _id goes in the token — never customerId/workerId.
  return jwt.sign(
    { id: user._id.toString(), role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/* ---------------------------- CUSTOMER ---------------------------- */

// POST /api/auth/customer/register
// Body: { name, email, phone, password, address }
router.post('/customer/register', async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const customerId = await getNextSequence('customerId'); // 101, 106, 111...
    const passwordHash = await bcrypt.hash(password, 10);

    const customer = await Customer.create({ customerId, name, email, phone, address, passwordHash });

    const token = signToken(customer, 'customer');
    // customerId intentionally NOT included here — private to admin only.
    res.status(201).json({ token, user: { name, email, phone, address } });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// POST /api/auth/customer/login
router.post('/customer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email: (email || '').toLowerCase() }).select('+passwordHash');
    if (!customer) return res.status(401).json({ message: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, customer.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    customer.lastLogin = new Date();
    customer.loginCount += 1;
    await customer.save();

    const token = signToken(customer, 'customer');
    res.json({
      token,
      user: { name: customer.name, email: customer.email, phone: customer.phone, address: customer.address },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

/* ----------------------------- WORKER ------------------------------ */

// POST /api/auth/worker/register
// Body: { name, email, phone, password, skill, category, cooperative, experienceYears }
router.post('/worker/register', async (req, res) => {
  try {
    const { name, email, phone, password, skill, category, cooperative, experienceYears } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    const existing = await Worker.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const workerId = await getNextSequence('workerId'); // 101, 106, 111...
    const passwordHash = await bcrypt.hash(password, 10);

    const worker = await Worker.create({
      workerId, name, email, phone, skill, category, cooperative, experienceYears, passwordHash,
    });

    const token = signToken(worker, 'worker');
    res.status(201).json({
      token,
      user: { name, email, phone, skill, category, cooperative, status: worker.status },
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// POST /api/auth/worker/login
router.post('/worker/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const worker = await Worker.findOne({ email: (email || '').toLowerCase() }).select('+passwordHash');
    if (!worker) return res.status(401).json({ message: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, worker.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    worker.lastLogin = new Date();
    worker.loginCount += 1;
    await worker.save();

    const token = signToken(worker, 'worker');
    res.json({
      token,
      user: {
        name: worker.name, email: worker.email, phone: worker.phone,
        skill: worker.skill, category: worker.category, cooperative: worker.cooperative,
        status: worker.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

/* ------------------------------ ADMIN ------------------------------- */

// POST /api/auth/admin/login  (admins are created only via "npm run seed:admin")
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: (email || '').toLowerCase() }).select('+passwordHash');
    if (!admin) return res.status(401).json({ message: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    admin.lastLogin = new Date();
    await admin.save();

    const token = signToken(admin, 'admin');
    res.json({ token, user: { name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

export default router;
