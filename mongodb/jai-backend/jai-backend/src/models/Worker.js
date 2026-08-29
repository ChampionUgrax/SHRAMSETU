import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema(
  {
    // Hidden from every query by default — same reasoning as Customer.js.
    workerId: { type: Number, required: true, unique: true, index: true, select: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    skill: { type: String, default: '' }, // Electrician, Plumber, Carpenter, ...
    category: { type: String, default: '' }, // matches CATEGORIES ids in mockData.js
    cooperative: { type: String, default: '' },
    experienceYears: { type: Number, default: 0 },
    pricePerVisit: { type: Number, default: 0 }, // used for fair-wage billing calc
    verification: {
      identityVerified: { type: Boolean, default: false },
      skillCertified: { type: Boolean, default: false },
      cooperativeVerified: { type: Boolean, default: false },
    },
    status: { type: String, enum: ['pending', 'verified', 'suspended'], default: 'pending' },
    lastLogin: { type: Date, default: null },
    loginCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Worker', workerSchema);
