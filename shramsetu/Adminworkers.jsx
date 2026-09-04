// ShramSetu Mock Data
// All data below is simulated for prototype/demo purposes only.

// Shared by the booking slot picker and the worker availability editor,
// so a worker's toggled slots line up exactly with what a customer sees.
export const TIME_SLOTS = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM']
export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// To Add the Services
export const CATEGORIES = [
  { id: 'electrical', name: 'Electrical', icon: 'Zap' },
  { id: 'plumbing', name: 'Plumbing', icon: 'Wrench' },
  { id: 'carpentry', name: 'Carpentry', icon: 'Hammer' },
  { id: 'painting', name: 'Painting', icon: 'PaintRoller' },
  { id: 'cleaning', name: 'Cleaning', icon: 'Sparkles' },
  { id: 'caregiving', name: 'Caregiving', icon: 'HeartHandshake' },
  { id: 'driving', name: 'Driving', icon: 'Car' },
  { id: 'gardening', name: 'Gardening', icon: 'Flower2' },
  { id: 'appliance', name: 'Appliance Repair', icon: 'Cog' },
]

// To add the States/Cooperatives
export const COOPERATIVES = [
  { id: 'coop-raj', name: 'Rajasthan Labour Cooperative', members: 1240, activeWorkers: 860, services: 12, rating: 4.7 },
  { id: 'coop-del', name: 'Delhi Labour Cooperative', members: 980, activeWorkers: 640, services: 10, rating: 4.6 },
  { id: 'coop-mh', name: 'Maharashtra Labour Cooperative', members: 1510, activeWorkers: 1020, services: 14, rating: 4.8 },
  { id: 'coop-guj', name: 'Gujarat Labour Cooperative', members: 890, activeWorkers: 520, services: 9, rating: 4.5 },
]

// To add workers
export const WORKERS = [
  {
    id: 'w1', name: 'Rajesh Kumar', skill: 'Electrician', category: 'electrical',
    cooperative: 'Rajasthan Labour Cooperative', verified: true, skillCertified: true, coopVerified: true,
    rating: 4.8, experience: 9, jobsCompleted: 412, location: 'Jaipur, Rajasthan', distance: 1.2,
    price: 250, availability: 'Available Today', avatarColor: '#1f2f57',
    certifications: ['ITI Certified Electrician', 'Cooperative Skill License Level 3'],
    reviews: [
      { customer: 'Anita Sharma', rating: 5, comment: 'Fixed wiring issue quickly and professionally.', quality: 5, punctuality: 5, professionalism: 5 },
      { customer: 'Vikram Joshi', rating: 4, comment: 'Good work, arrived slightly late.', quality: 5, punctuality: 3, professionalism: 4 },
    ],
  },
  {
    id: 'w2', name: 'Priya Sharma', skill: 'Caregiver', category: 'caregiving',
    cooperative: 'Delhi Labour Cooperative', verified: true, skillCertified: true, coopVerified: true,
    rating: 4.9, experience: 6, jobsCompleted: 268, location: 'Dwarka, Delhi', distance: 2.6,
    price: 400, availability: 'Available Today', avatarColor: '#1e8f54',
    certifications: ['Certified Elderly Caregiver', 'First Aid Trained'],
    reviews: [
      { customer: 'Ramesh Gupta', rating: 5, comment: 'Very caring and attentive with my mother.', quality: 5, punctuality: 5, professionalism: 5 },
    ],
  },
  {
    id: 'w3', name: 'Amit Verma', skill: 'Plumber', category: 'plumbing',
    cooperative: 'Rajasthan Labour Cooperative', verified: true, skillCertified: true, coopVerified: true,
    rating: 4.6, experience: 7, jobsCompleted: 355, location: 'Malviya Nagar, Jaipur', distance: 2.4,
    price: 220, availability: 'Available Tomorrow', avatarColor: '#e26e0a',
    certifications: ['ITI Certified Plumber'],
    reviews: [
      { customer: 'Suresh Rathi', rating: 4, comment: 'Solved the leakage issue well.', quality: 4, punctuality: 4, professionalism: 5 },
    ],
  },
  {
    id: 'w4', name: 'Sunita Devi', skill: 'Domestic Helper', category: 'cleaning',
    cooperative: 'Maharashtra Labour Cooperative', verified: true, skillCertified: false, coopVerified: true,
    rating: 4.7, experience: 5, jobsCompleted: 301, location: 'Andheri, Mumbai', distance: 1.8,
    price: 180, availability: 'Available Today', avatarColor: '#1e8f54',
    certifications: ['Cooperative Skill License Level 2'],
    reviews: [
      { customer: 'Meera Nair', rating: 5, comment: 'Very thorough and punctual.', quality: 5, punctuality: 5, professionalism: 5 },
    ],
  },
  {
    id: 'w5', name: 'Mohammed Arif', skill: 'Carpenter', category: 'carpentry',
    cooperative: 'Gujarat Labour Cooperative', verified: true, skillCertified: true, coopVerified: true,
    rating: 4.5, experience: 11, jobsCompleted: 489, location: 'Navrangpura, Ahmedabad', distance: 3.1,
    price: 300, availability: 'Available Today', avatarColor: '#1f2f57',
    certifications: ['Master Carpenter Certification'],
    reviews: [
      { customer: 'Falguni Patel', rating: 4, comment: 'Great furniture repair work.', quality: 4, punctuality: 4, professionalism: 4 },
    ],
  },
  {
    id: 'w6', name: 'Ravi Singh', skill: 'Painter', category: 'painting',
    cooperative: 'Delhi Labour Cooperative', verified: true, skillCertified: true, coopVerified: true,
    rating: 4.4, experience: 8, jobsCompleted: 214, location: 'Rohini, Delhi', distance: 4.0,
    price: 260, availability: 'Available in 2 days', avatarColor: '#e26e0a',
    certifications: ['Cooperative Skill License Level 2'],
    reviews: [
      { customer: 'Karan Mehta', rating: 4, comment: 'Neat finishing, fair pricing.', quality: 4, punctuality: 4, professionalism: 4 },
    ],
  },
  {
    id: 'w7', name: 'Meena Patel', skill: 'Cleaner', category: 'cleaning',
    cooperative: 'Gujarat Labour Cooperative', verified: true, skillCertified: false, coopVerified: true,
    rating: 4.6, experience: 4, jobsCompleted: 178, location: 'Satellite, Ahmedabad', distance: 1.5,
    price: 150, availability: 'Available Today', avatarColor: '#1e8f54',
    certifications: ['Cooperative Skill License Level 1'],
    reviews: [
      { customer: 'Nisha Shah', rating: 5, comment: 'Excellent deep cleaning service.', quality: 5, punctuality: 5, professionalism: 5 },
    ],
  },
  {
    id: 'w8', name: 'Arjun Yadav', skill: 'Technician', category: 'appliance',
    cooperative: 'Maharashtra Labour Cooperative', verified: true, skillCertified: true, coopVerified: true,
    rating: 4.7, experience: 6, jobsCompleted: 233, location: 'Kothrud, Pune', distance: 2.9,
    price: 280, availability: 'Available Today', avatarColor: '#1f2f57',
    certifications: ['Appliance Repair Certification'],
    reviews: [
      { customer: 'Deepak Kulkarni', rating: 5, comment: 'Fixed the washing machine in 30 minutes.', quality: 5, punctuality: 5, professionalism: 5 },
    ],
  },
]

export const DEMO_WORKER = WORKERS[0] // Rajesh Kumar used for Worker Dashboard demo

export const SERVICES_MENU = [
  { id: 's1', category: 'electrical', name: 'Wiring Repair', basePrice: 250 },
  { id: 's2', category: 'electrical', name: 'Switchboard Installation', basePrice: 300 },
  { id: 's3', category: 'plumbing', name: 'Leak Fixing', basePrice: 220 },
  { id: 's4', category: 'plumbing', name: 'Pipe Installation', basePrice: 350 },
  { id: 's5', category: 'carpentry', name: 'Furniture Repair', basePrice: 300 },
  { id: 's6', category: 'painting', name: 'Room Painting', basePrice: 260 },
  { id: 's7', category: 'cleaning', name: 'Deep Home Cleaning', basePrice: 180 },
  { id: 's8', category: 'caregiving', name: 'Elderly Care (per visit)', basePrice: 400 },
  { id: 's9', category: 'appliance', name: 'Appliance Repair', basePrice: 280 },
]

export const AI_DEMAND_FORECAST = [
  { skill: 'Electrical', change: 24, trend: [40, 44, 48, 46, 52, 58, 62] },
  { skill: 'Plumbing', change: 17, trend: [30, 32, 35, 33, 37, 39, 41] },
  { skill: 'Caregiving', change: 31, trend: [20, 24, 27, 30, 34, 39, 44] },
  { skill: 'Cleaning', change: 12, trend: [50, 51, 53, 52, 55, 56, 58] },
]

export const AI_RECOMMENDATIONS = [
  'Increase electrician availability in Zone A by 15% for the coming weekend.',
  '3 additional caregivers may be required during weekends in South Delhi.',
  'Plumbing demand expected to peak between 6 PM and 9 PM on weekdays.',
  '5 workers are currently underutilized and can be reassigned to high-demand zones.',
  'Painting requests typically rise 20% during the post-monsoon season.',
]

export const NEARBY_WORKERS = [
  { id: 'n1', name: 'Rajesh Kumar', skill: 'Electrician', category: 'electrical', distance: 1.2, top: 22, left: 38, rating: 4.8 },
  { id: 'n2', name: 'Amit Verma', skill: 'Plumber', category: 'plumbing', distance: 2.4, top: 55, left: 62, rating: 4.6 },
  { id: 'n3', name: 'Mohammed Arif', skill: 'Carpenter', category: 'carpentry', distance: 3.1, top: 70, left: 25, rating: 4.5 },
  { id: 'n4', name: 'Meena Patel', skill: 'Cleaner', category: 'cleaning', distance: 1.8, top: 35, left: 72, rating: 4.6 },
  { id: 'n5', name: 'Ravi Singh', skill: 'Painter', category: 'painting', distance: 4.0, top: 15, left: 60, rating: 4.4 },
]

export const EMERGENCY_TYPES = [
  { id: 'e1', name: 'Electrical Emergency', category: 'electrical', icon: 'Zap' },
  { id: 'e2', name: 'Plumbing Emergency', category: 'plumbing', icon: 'Wrench' },
  { id: 'e3', name: 'Caregiver Assistance', category: 'caregiving', icon: 'HeartHandshake' },
  { id: 'e4', name: 'Appliance Failure', category: 'appliance', icon: 'Cog' },
  { id: 'e5', name: 'Other', category: 'electrical', icon: 'AlertTriangle' },
]

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
]

// For adding the language translations
export const TRANSLATIONS = {
  en: { home: 'Home', services: 'Services', nearby: 'Nearby', bookings: 'Bookings', dashboard: 'Dashboard', profile: 'Profile' },
  hi: { home: 'होम', services: 'सेवाएं', nearby: 'आस-पास', bookings: 'बुकिंग', dashboard: 'डैशबोर्ड', profile: 'प्रोफ़ाइल' },
  mr: { home: 'मुख्यपृष्ठ', services: 'सेवा', nearby: 'जवळपास', bookings: 'बुकिंग', dashboard: 'डॅशबोर्ड', profile: 'प्रोफाइल' },
  bn: { home: 'হোম', services: 'সেবা', nearby: 'কাছাকাছি', bookings: 'বুকিং', dashboard: 'ড্যাশবোর্ড', profile: 'প্রোফাইল' },
  ta: { home: 'முகப்பு', services: 'சேவைகள்', nearby: 'அருகில்', bookings: 'முன்பதிவுகள்', dashboard: 'டாஷ்போர்டு', profile: 'சுயவிவரம்' },
}

// For showcasing the notification on the screen 
export const DEFAULT_NOTIFICATIONS = [
  { id: 'note1', text: 'Your electrician booking is confirmed.', time: '5 min ago', read: false },
  { id: 'note2', text: 'New worker request received.', time: '1 hr ago', read: false },
  { id: 'note3', text: 'Your service has been completed.', time: '3 hr ago', read: true },
  { id: 'note4', text: 'Payment received.', time: 'Yesterday', read: true },
  { id: 'note5', text: 'New cooperative opportunity available.', time: '2 days ago', read: true },
]

// Welfare info editing
export const WELFARE_INFO = {
  insuranceStatus: 'ACTIVE',
  coverage: 500000,
  welfareFund: 12500,
  membershipStatus: 'ACTIVE',
  emergencySupport: 'AVAILABLE',
  benefits: [
    'Group accident insurance coverage up to ₹5,00,000',
    'Cooperative welfare fund contribution matching',
    'Emergency medical assistance within 24 hours',
    'Skill upgrade training sponsored by the cooperative',
    'Pension contribution scheme for members above 5 years tenure',
  ],
}

// Admin panel request
export const JOB_REQUESTS = [
  { id: 'jr1', customer: 'Anita Sharma', service: 'Wiring Repair', location: 'Vaishali Nagar, Jaipur', date: '2026-08-22', time: '11:00 AM', distance: 1.4, earnings: 250 },
  { id: 'jr2', customer: 'Karan Mehta', service: 'Switchboard Installation', location: 'C-Scheme, Jaipur', date: '2026-08-22', time: '3:00 PM', distance: 3.2, earnings: 300 },
  { id: 'jr3', customer: 'Neha Agarwal', service: 'Fan Installation', location: 'Mansarovar, Jaipur', date: '2026-08-23', time: '10:00 AM', distance: 2.1, earnings: 180 },
]

export const ADMIN_WORKERS = WORKERS.map((w) => ({
  ...w,
  status: w.verified ? 'Active' : 'Pending',
}))

// For Adding more confirmed bookings
export const ADMIN_BOOKINGS = [
  { id: 'BK-1001', customer: 'Anita Sharma', worker: 'Rajesh Kumar', service: 'Wiring Repair', location: 'Jaipur', date: '2026-08-20', amount: 250, status: 'Completed' },
  { id: 'BK-1002', customer: 'Vikram Joshi', worker: 'Amit Verma', service: 'Leak Fixing', location: 'Jaipur', date: '2026-08-21', amount: 220, status: 'In Progress' },
  { id: 'BK-1003', customer: 'Meera Nair', worker: 'Sunita Devi', service: 'Deep Home Cleaning', location: 'Mumbai', date: '2026-08-21', amount: 180, status: 'Confirmed' },
  { id: 'BK-1004', customer: 'Falguni Patel', worker: 'Mohammed Arif', service: 'Furniture Repair', location: 'Ahmedabad', date: '2026-08-19', amount: 300, status: 'Cancelled' },
  { id: 'BK-1005', customer: 'Deepak Kulkarni', worker: 'Arjun Yadav', service: 'Appliance Repair', location: 'Pune', date: '2026-08-20', amount: 280, status: 'Completed' },
]

export const MONTHLY_BOOKINGS = [120, 145, 132, 168, 190, 210, 238]
export const MONTHLY_REVENUE = [180000, 210000, 198000, 245000, 268000, 292000, 315000]
export const MOST_DEMANDED_SERVICES = [
  { name: 'Electrical', value: 34 },
  { name: 'Plumbing', value: 22 },
  { name: 'Cleaning', value: 18 },
  { name: 'Caregiving', value: 16 },
  { name: 'Carpentry', value: 10 },
]
