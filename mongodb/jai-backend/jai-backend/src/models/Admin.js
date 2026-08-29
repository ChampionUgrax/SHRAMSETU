import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    adminId: { type: Number, required: true, unique: true, index: true, select: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Admin', adminSchema);
