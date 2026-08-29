import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// MongoDB Database Initialization
try {
  await connectDB();
} catch (error) {
  console.error(`Database connection failure: ${error.message}`);
  process.exit(1);
}

// System Health Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ShramSetu REST Core',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// REST API Modular Routing
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/admin', adminRoutes);

// Catch-All 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint does not exist`
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`[Server Exception] ${err.stack || err.message}`);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`[HTTP] Server active on port ${PORT}`);
});