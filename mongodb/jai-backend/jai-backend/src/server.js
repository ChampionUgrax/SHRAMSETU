import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// System Health Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ShramSetu REST Core',
    timestamp: new Date().toISOString()
  });
});

// Map Location Endpoint (Added here directly)
app.get('/api/location', (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { id: 1, name: "Ramesh Kumar", skill: "Electrician", lat: 26.9124, lng: 75.7873 },
      { id: 2, name: "Suresh Sharma", skill: "Plumber", lat: 26.8910, lng: 75.8010 }
    ]
  });
});

// REST API Modular Routing
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

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

// Bind HTTP Server first, then connect to Database
app.listen(PORT, () => {
  console.log(`[HTTP] Server active on port ${PORT}`);
  connectDB();
});