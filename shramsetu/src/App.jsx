import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetails from './pages/ServiceDetails'
import Booking from './pages/Booking'
import CustomerDashboard from './pages/CustomerDashboard'
import WorkerDashboard from './pages/WorkerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AIInsights from './pages/AIInsights'
import Nearby from './pages/Nearby'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fb]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/nearby" element={<Nearby />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer className="bg-navy-700 text-navy-100 mt-12">
        <div className="container-app py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-coop-500 flex items-center justify-center text-white font-display font-bold">S</div>
              <span className="font-display font-bold text-white">SHRAMSETU</span>
            </div>
            <p className="text-navy-300 text-xs leading-relaxed">Skilled Hands. Trusted Services. Stronger Communities. A cooperative-owned digital service marketplace.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Platform</p>
            <ul className="space-y-2 text-navy-300">
              <li>Services</li>
              <li>Nearby Workers</li>
              <li>Emergency Services</li>
              <li>AI Workforce Intelligence</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Cooperative</p>
            <ul className="space-y-2 text-navy-300">
              <li>Worker Welfare</li>
              <li>Become a Worker</li>
              <li>Cooperative Network</li>
              <li>Fair Wage Policy</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Future Roadmap</p>
            <p className="text-navy-300 text-xs leading-relaxed">React Native mobile app · Node.js + Express backend · MongoDB · AI/ML workforce allocation · Geo-spatial matching · Digital payments · Cloud infrastructure</p>
          </div>
        </div>
        <div className="border-t border-navy-600 py-4 text-center text-xs text-navy-400">
          © 2026 ShramSetu Cooperative Technology Prototype. Hackathon Demo — Not for production use.
        </div>
      </footer>
    </div>
  )
}
