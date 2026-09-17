const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export async function createPaymentOrder(
  amount,
  bookingId
) {
  const response = await fetch(
    `${API_BASE_URL}/api/payment/create-order`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        bookingId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Unable to create payment order."
    );
  }

  return data.order;
}

export async function verifyPayment(
  paymentData
) {
  const response = await fetch(
    `${API_BASE_URL}/api/payment/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Payment verification failed."
    );
  }

  return data;
}