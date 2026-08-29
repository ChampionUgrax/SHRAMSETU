import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    // select: false => this field is EXCLUDED from every query result
    // unless someone explicitly asks for it with .select('+customerId').
    // Only the admin routes do that, so customers/workers never see
    // their own internal id in any API response.
    customerId: { type: Number, required: true, unique: true, index: true, select: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    address: { type: String, default: '' },
    lastLogin: { type: Date, default: null },
    loginCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Customer', customerSchema);
