// File: mongodb/jai-backend/jai-backend/src/config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('[MongoDB] Connecting to Atlas cluster...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;