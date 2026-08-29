import React, { useEffect, useState } from 'react'
import {
  Users, ShieldCheck, CalendarCheck, CheckCircle2, IndianRupee, Wallet,
  Eye, Ban, BadgeCheck, LayoutGrid, Table2, BarChart3, Building2, Loader2,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { StatCard, Button, StatusPill, RatingStars, Badge } from '../components/UI'
import {
  ADMIN_BOOKINGS, COOPERATIVES, MONTHLY_BOOKINGS,
  MONTHLY_REVENUE, MOST_DEMANDED_SERVICES,
} from '../data/mockData'
import { listWorkers, verifyWorker as verifyWorkerApi, suspendWorker as suspendWorkerApi } from '../api'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'workers', label: 'Worker Management', icon: Users },
  { id: 'bookings', label: 'Booking Management', icon: Table2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'network', label: 'Cooperative Network', icon: Building2 },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingFilter, setBookingFilter] = useState('All')

  useEffect(() => {
    let cancelled = false
    listWorkers().then((data) => {
      if (!cancelled) {
        setWorkers(data)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [])

  const verifyWorker = async (id) => {
    setWorkers((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'Active', verified: true } : w)))
    await verifyWorkerApi(id)
  }
  const suspendWorker = async (id) => {
    setWorkers((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'Suspended' } : w)))
    await suspendWorkerApi(id)
  }

  const filteredBookings = bookingFilter === 'All' ? ADMIN_BOOKINGS : ADMIN_BOOKINGS.filter((b) => b.status === bookingFilter)

  const totalRevenue = ADMIN_BOOKINGS.reduce((s, b) => s + b.amount, 0)
  const maxBooking = Math.max(...MONTHLY_BOOKINGS)
  const maxRevenue = Math.max(...MONTHLY_REVENUE)
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

  return (
    <div className="container-app py-8">
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-navy-700">Cooperative Admin Dashboard</h1>
      <p className="text-navy-400 text-sm mt-1">Labour Cooperative Federation control center</p>

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <Sidebar items={TABS.map((t) => ({ ...t, active: tab === t.id, onClick: () => setTab(t.id) }))} />

        <div className="flex-1 min-w-0 space-y-6">
          {tab === 'overview' && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard icon={Users} label="Total Workers" value={workers.length} color="navy" />
                <StatCard icon={ShieldCheck} label="Verified Workers" value={workers.filter((w) => w.verified).length} color="coop" />
                <StatCard icon={CalendarCheck} label="Active Bookings" value={ADMIN_BOOKINGS.filter((b) => b.status !== 'Completed' && b.status !== 'Cancelled').length} color="saffron" />
                <StatCard icon={CheckCircle2} label="Completed Services" value={ADMIN_BOOKINGS.filter((b) => b.status === 'Completed').length} color="coop" />
                <StatCard icon={IndianRupee} label="Monthly Revenue" value={`₹${(totalRevenue * 40).toLocaleString('en-IN')}`} color="navy" />
                <StatCard icon={Wallet} label="Worker Earnings" value={`₹${(totalRevenue * 28).toLocaleString('en-IN')}`} color="saffron" />
              </div>
            </>
          )}

          {tab === 'workers' && loading && (
            <div className="flex items-center gap-2 text-navy-400 text-sm"><Loader2 size={16} className="animate-spin" /> Loading workers...</div>
          )}

          {tab === 'workers' && !loading && (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[720px]">
                  <thead className="bg-navy-50 text-navy-500 text-xs uppercase">
                    <tr>
                      <th className="text-left px-4 py-3">Worker</th>
                      <th className="text-left px-4 py-3">Skill</th>
                      <th className="text-left px-4 py-3">Cooperative</th>
                      <th className="text-left px-4 py-3">Verification</th>
                      <th className="text-left px-4 py-3">Rating</th>
                      <th className="text-left px-4 py-3">Jobs</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map((w) => (
                      <tr key={w.id} className="border-t border-navy-50">
                        <td className="px-4 py-3 font-semibold text-navy-700 whitespace-nowrap">{w.name}</td>
                        <td className="px-4 py-3 text-navy-500">{w.skill}</td>
                        <td className="px-4 py-3 text-navy-500 whitespace-nowrap">{w.cooperative}</td>
                        <td className="px-4 py-3">{w.verified ? <Badge color="coop"><BadgeCheck size={12}/> Verified</Badge> : <Badge color="gray">Pending</Badge>}</td>
                        <td className="px-4 py-3"><RatingStars rating={w.rating} size={12} /></td>
                        <td className="px-4 py-3 text-navy-500">{w.jobsCompleted}</td>
                        <td className="px-4 py-3"><StatusPill status={w.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            <button className="p-1.5 rounded-lg hover:bg-navy-50 text-navy-400"><Eye size={15} /></button>
                            {w.status !== 'Active' && (
                              <button onClick={() => verifyWorker(w.id)} className="p-1.5 rounded-lg hover:bg-coop-50 text-coop-500"><BadgeCheck size={15} /></button>
                            )}
                            {w.status !== 'Suspended' && (
                              <button onClick={() => suspendWorker(w.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Ban size={15} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'bookings' && (
            <div>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {['All', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setBookingFilter(f)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap ${bookingFilter === f ? 'bg-navy-500 text-white' : 'bg-white text-navy-500 border border-navy-100'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[720px]">
                    <thead className="bg-navy-50 text-navy-500 text-xs uppercase">
                      <tr>
                        <th className="text-left px-4 py-3">Booking ID</th>
                        <th className="text-left px-4 py-3">Customer</th>
                        <th className="text-left px-4 py-3">Worker</th>
                        <th className="text-left px-4 py-3">Service</th>
                        <th className="text-left px-4 py-3">Location</th>
                        <th className="text-left px-4 py-3">Date</th>
                        <th className="text-left px-4 py-3">Amount</th>
                        <th className="text-left px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="border-t border-navy-50">
                          <td className="px-4 py-3 font-semibold text-navy-700 whitespace-nowrap">{b.id}</td>
                          <td className="px-4 py-3 text-navy-500">{b.customer}</td>
                          <td className="px-4 py-3 text-navy-500">{b.worker}</td>
                          <td className="px-4 py-3 text-navy-500">{b.service}</td>
                          <td className="px-4 py-3 text-navy-500">{b.location}</td>
                          <td className="px-4 py-3 text-navy-500 whitespace-nowrap">{b.date}</td>
                          <td className="px-4 py-3 font-semibold text-navy-700">₹{b.amount}</td>
                          <td className="px-4 py-3"><StatusPill status={b.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === 'analytics' && (
            <div className="grid lg:grid-cols-2 gap-5">
              <div className="card p-6">
                <p className="font-display font-bold text-navy-700 mb-4">Monthly Bookings</p>
                <div className="flex items-end gap-3 h-40">
                  {MONTHLY_BOOKINGS.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full bg-navy-400 hover:bg-navy-500 rounded-t-md transition-colors" style={{ height: `${(v / maxBooking) * 100}%` }} title={v} />
                      <span className="text-[11px] text-navy-300">{months[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <p className="font-display font-bold text-navy-700 mb-4">Revenue Trend</p>
                <div className="flex items-end gap-3 h-40">
                  {MONTHLY_REVENUE.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full bg-coop-400 hover:bg-coop-500 rounded-t-md transition-colors" style={{ height: `${(v / maxRevenue) * 100}%` }} title={`₹${v}`} />
                      <span className="text-[11px] text-navy-300">{months[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <p className="font-display font-bold text-navy-700 mb-4">Worker Utilization</p>
                <div className="space-y-3">
                  {[['Electricians', 82], ['Plumbers', 68], ['Caregivers', 74], ['Cleaners', 59]].map(([label, pct]) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs text-navy-500 mb-1"><span>{label}</span><span>{pct}%</span></div>
                      <div className="h-2 rounded-full bg-navy-50 overflow-hidden">
                        <div className="h-full bg-navy-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <p className="font-display font-bold text-navy-700 mb-4">Most Demanded Services</p>
                <div className="space-y-3">
                  {MOST_DEMANDED_SERVICES.map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-xs text-navy-500 mb-1"><span>{s.name}</span><span>{s.value}%</span></div>
                      <div className="h-2 rounded-full bg-navy-50 overflow-hidden">
                        <div className="h-full bg-saffron-500 rounded-full" style={{ width: `${s.value * 2.5}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'network' && (
            <div className="grid sm:grid-cols-2 gap-5">
              {COOPERATIVES.map((c) => (
                <div key={c.id} className="card p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-navy-500 text-white flex items-center justify-center"><Building2 size={19} /></div>
                    <div>
                      <p className="font-display font-bold text-navy-700">{c.name}</p>
                      <RatingStars rating={c.rating} size={12} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="font-display font-bold text-navy-700">{c.members}</p>
                      <p className="text-xs text-navy-300">Members</p>
                    </div>
                    <div>
                      <p className="font-display font-bold text-navy-700">{c.activeWorkers}</p>
                      <p className="text-xs text-navy-300">Active Workers</p>
                    </div>
                    <div>
                      <p className="font-display font-bold text-navy-700">{c.services}</p>
                      <p className="text-xs text-navy-300">Services</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
