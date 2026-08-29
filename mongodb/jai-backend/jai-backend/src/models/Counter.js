import mongoose from 'mongoose';

// One doc per sequence name ("customerId", "workerId", "adminId").
// "seq" always holds the LAST value handed out.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, required: true, default: 96 },
});

export default mongoose.model('Counter', counterSchema);
