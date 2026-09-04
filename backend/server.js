const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Razorpay SDK
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

// Security & Parsing Middleware (Allowing all origins for production frontend)
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// In-Memory Data Repositories
let workers = [
  { id: 1, name: "Ramesh Kumar", skill: "Electrician", society: "Jaipur Labour Union", experienceYears: 8, jobsCompleted: 142, rating: 4.8, hourlyRate: 350, verified: true, suspended: false, lat: 26.9124, lng: 75.7873 },
  { id: 2, name: "Suresh Sharma", skill: "Plumber", society: "North Cooperative Society", experienceYears: 6, jobsCompleted: 98, rating: 4.9, hourlyRate: 300, verified: true, suspended: false, lat: 26.8910, lng: 75.8010 },
  { id: 3, name: "Anita Devi", skill: "Caregiving", society: "Central Welfare Society", experienceYears: 10, jobsCompleted: 215, rating: 5.0, hourlyRate: 400, verified: true, suspended: false, lat: 26.9200, lng: 75.7700 }
];

let bookings = [
  {
    id: 101,
    workerId: 1,
    workerName: "Ramesh Kumar",
    skill: "Electrician",
    customerName: "Pooja Mehta",
    serviceDate: "2026-08-30",
    timeSlot: "10:00 AM",
    hoursBooked: 2,
    totalAmount: 700,
    status: "Confirmed",
    address: "B-12, Malviya Nagar, Jaipur",
    createdAt: new Date().toISOString()
  }
];

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ status: "healthy", service: "ShramSetu REST Engine", port: PORT });
});

// GET /api/location - Serves worker GPS coordinates for Map Component
app.get('/api/location', (req, res) => {
  const activeWorkerLocations = workers
    .filter(w => !w.suspended)
    .map(w => ({ id: w.id, name: w.name, skill: w.skill, lat: w.lat, lng: w.lng }));
  res.status(200).json({ success: true, count: activeWorkerLocations.length, data: activeWorkerLocations });
});

// POST /api/payments/create-order - Razorpay Order Creation Endpoint
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: (amount || 500) * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order", error: error.message });
  }
});

// GET /api/workers
app.get('/api/workers', (req, res) => {
  const { skill, verified } = req.query;
  let result = workers.filter(w => !w.suspended);

  if (skill) {
    result = result.filter(w => w.skill.toLowerCase() === skill.toLowerCase());
  }
  if (verified !== undefined) {
    result = result.filter(w => w.verified === (verified === 'true'));
  }

  res.status(200).json({ success: true, count: result.length, data: result });
});

// GET /api/workers/:id
app.get('/api/workers/:id', (req, res) => {
  const worker = workers.find(w => w.id === parseInt(req.params.id));
  if (!worker) {
    return res.status(404).json({ success: false, message: "Worker not found" });
  }
  res.status(200).json({ success: true, data: worker });
});

// POST /api/workers
app.post('/api/workers', (req, res) => {
  const { name, skill, society, hourlyRate, experienceYears } = req.body;
  if (!name || !skill || !society || !hourlyRate) {
    return res.status(400).json({ success: false, message: "Required fields missing: name, skill, society, hourlyRate" });
  }

  const newWorker = {
    id: workers.length > 0 ? Math.max(...workers.map(w => w.id)) + 1 : 1,
    name,
    skill,
    society,
    experienceYears: Number(experienceYears) || 1,
    jobsCompleted: 0,
    rating: 5.0,
    hourlyRate: Number(hourlyRate),
    verified: false,
    suspended: false,
    lat: 26.9124 + (Math.random() - 0.5) * 0.04,
    lng: 75.7873 + (Math.random() - 0.5) * 0.04
  };

  workers.push(newWorker);
  res.status(201).json({ success: true, message: "Worker enrolled successfully", data: newWorker });
});

// GET /api/admin/workers
app.get('/api/admin/workers', (req, res) => {
  res.status(200).json({ success: true, count: workers.length, data: workers });
});

// PATCH /api/admin/workers/:id/verify
app.patch('/api/admin/workers/:id/verify', (req, res) => {
  const workerId = parseInt(req.params.id);
  const worker = workers.find(w => w.id === workerId);
  if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });

  worker.verified = true;
  worker.suspended = false;
  res.status(200).json({ success: true, message: "Worker verified", data: worker });
});

// PATCH /api/admin/workers/:id/suspend
app.patch('/api/admin/workers/:id/suspend', (req, res) => {
  const workerId = parseInt(req.params.id);
  const worker = workers.find(w => w.id === workerId);
  if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });

  worker.verified = false;
  worker.suspended = true;
  res.status(200).json({ success: true, message: "Worker suspended", data: worker });
});

// GET /api/bookings
app.get('/api/bookings', (req, res) => {
  res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

// POST /api/bookings
app.post('/api/bookings', (req, res) => {
  const { workerId, customerName, serviceDate, timeSlot, hoursBooked, address } = req.body;

  if (!workerId || !customerName || !hoursBooked) {
    return res.status(400).json({ success: false, message: "Required fields missing: workerId, customerName, hoursBooked" });
  }

  const worker = workers.find(w => w.id === parseInt(workerId));
  if (!worker) return res.status(404).json({ success: false, message: "Designated worker does not exist" });

  const calculatedTotal = worker.hourlyRate * Number(hoursBooked);

  const newBooking = {
    id: bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 101,
    workerId: worker.id,
    workerName: worker.name,
    skill: worker.skill,
    customerName,
    serviceDate: serviceDate || new Date().toISOString().split('T')[0],
    timeSlot: timeSlot || "10:00 AM",
    hoursBooked: Number(hoursBooked),
    totalAmount: calculatedTotal,
    status: "Confirmed",
    address: address || "Default Address",
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  res.status(201).json({ success: true, message: "Booking confirmed", data: newBooking });
});

// PATCH /api/bookings/:id/status
app.patch('/api/bookings/:id/status', (req, res) => {
  const { status } = req.body;
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) return res.status(404).json({ success: false, message: "Booking record not found" });

  booking.status = status;
  res.status(200).json({ success: true, message: "Status updated", data: booking });
});

// Global 404 Catch
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.originalUrl} not found on this server` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error", error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});