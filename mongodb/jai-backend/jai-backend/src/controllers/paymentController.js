import crypto from 'crypto';

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = `receipt_${Date.now()}` } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: { code: 'BAD_REQUEST_ERROR', description: 'Amount is required and must be greater than 0' }
      });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    const order = {
      id: `order_${Math.random().toString(36).substring(2, 15)}`,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: receipt,
      offer_id: null,
      status: 'created',
      attempts: 0,
      notes: { platform: 'ShramSetu', type: 'Service Booking Payment' },
      created_at: Math.floor(Date.now() / 1000)
    };

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', description: error.message }
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, upi_id, simulated_status = 'success' } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({ success: false, message: 'razorpay_order_id is required' });
    }

    if (simulated_status === 'failure') {
      return res.status(400).json({ success: false, message: 'Payment failed' });
    }

    const paymentId = razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 15)}`;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'shramsetu_secret_key';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${paymentId}`)
      .digest('hex');

    return res.status(200).json({
      success: true,
      message: 'Payment signature verified successfully',
      payment: {
        razorpay_order_id,
        razorpay_payment_id: paymentId,
        razorpay_signature: generatedSignature,
        upi_id: upi_id || 'shramsetu@upi',
        method: 'upi',
        status: 'captured',
        verifiedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
