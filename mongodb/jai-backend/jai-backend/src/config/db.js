import mongoose from 'mongoose';
import Counter from '../models/Counter.js';

// Every ID counter starts at 96 so the FIRST id generated is 101.
// Each new record then adds 5: 101, 106, 111, 116 ...
const COUNTER_NAMES = ['customerId', 'workerId', 'adminId'];
const STARTING_SEQ = 96;

export async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shramsetu';
  await mongoose.connect(uri);
  console.log(`[MongoDB] Connected -> ${uri}`);

  await Promise.all(
    COUNTER_NAMES.map((name) =>
      Counter.updateOne({ _id: name }, { $setOnInsert: { seq: STARTING_SEQ } }, { upsert: true })
    )
  );
  console.log('[MongoDB] ID counters ready — customerId & workerId start at 101, +5 each');
}

export default connectDB;
