/**
 * ShramSetu Backend - Payment Routes
 * File: src/routes/paymentRoutes.js
 */

import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

// Route to create a new payment order
router.post('/create-order', createOrder);

// Route to verify payment signature (UPI / Razorpay)
router.post('/verify', verifyPayment);

export default router;
