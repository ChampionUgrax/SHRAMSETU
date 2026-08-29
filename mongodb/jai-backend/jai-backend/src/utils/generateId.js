import Counter from '../models/Counter.js';

/**
 * Returns the next id for a sequence, atomically (safe even if two people
 * sign up at the exact same millisecond).
 * Call 1 -> 101, Call 2 -> 106, Call 3 -> 111 ...
 */
export async function getNextSequence(counterName) {
  const counter = await Counter.findOneAndUpdate(
    { _id: counterName },
    { $inc: { seq: 5 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}
