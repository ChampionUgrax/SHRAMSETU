import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Admin from '../models/Admin.js';
import { getNextSequence } from './generateId.js';

// Run once: npm run seed:admin
async function run() {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || 'admin@shramsetu.coop').toLowerCase();
  const name = process.env.ADMIN_NAME || 'ShramSetu Admin';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  const adminId = await getNextSequence('adminId'); // 101, 106, 111...
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ adminId, name, email, passwordHash });

  console.log(`Created admin -> internal id: ${admin.adminId} (private), email: ${admin.email}`);
  console.log('Log in with this email + the ADMIN_PASSWORD from your .env file.');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
