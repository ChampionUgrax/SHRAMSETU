import React, { useState } from 'react';
import { loadRazorpayScript } from '../utils/razorpay';

export default function RazorpayPayment({ amount, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      setLoading(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TY0Hpg5Y6OpIWW',
      amount: (amount || 500) * 100, // Amount in paise
      currency: 'INR',
      name: 'SHRAMSETU',
      description: 'Service Booking Payment',
      handler: function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        if (onPaymentSuccess) {
          onPaymentSuccess(response);
        }
      },
      prefill: {
        name: 'Test Customer',
        email: 'test@shramsetu.com',
        contact: '9999999999',
      },
      theme: {
        color: '#1e293b',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-coop-500 hover:bg-coop-600 text-white font-bold py-3 px-4 rounded-xl shadow transition"
    >
      {loading ? 'Opening Razorpay...' : `Pay ₹${amount || 500} with Razorpay`}
    </button>
  );
}