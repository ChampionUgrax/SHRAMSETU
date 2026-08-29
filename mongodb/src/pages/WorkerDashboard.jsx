import React, { useEffect, useState } from 'react'
import {
  Briefcase, IndianRupee, CalendarClock, Star, ShieldCheck, Check, X,
  ShieldPlus, Wallet, HeartHandshake, PhoneCall, TrendingUp, Loader2,
  CalendarDays, Save,
} from 'lucide-react'
import { StatCard, Button, Badge, StatusPill, RatingStars } from '../components/UI'
import { DEMO_WORKER, WELFARE_INFO, WEEK_DAYS, TIME_SLOTS } from '../data/mockData'
import { listJobs, updateJobStatus, getAvailability, setAvailability } from '../api'

const EARNINGS_WEEK = [1200, 1450, 900, 1600, 1750, 2100, 1300]
const DAYS = WEEK_DAYS

export default function WorkerDashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [availability, setAvailabilityState] = useState(null)
  const [savingAvailability, setSavingAvailability] = useState(false)
  const [savedJustNow, setSavedJustNow] = useState(false)

  useEffect(() => {
    let cancelled = false
    listJobs().then((data) => {
      if (!cancelled) {
        setJobs(data)
        setLoading(false)
      }
    })
    getAvailability(DEMO_WORKER.id).then((data) => {
      if (!cancelled) setAvailabilityState(data)
    })

    // Poll for newly-created job requests (e.g. a customer's live booking
    // request from another tab) so this dashboard updates without a refresh.
    const interval = setInterval(() => {
      listJobs().then((data) => {
        if (!cancelled) setJobs(data)
      })
    }, 3000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const updateStatus = async (id, status) => {
    // optimistic update, then confirm against the "API"
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)))
    await updateJobStatus(id, status)
  }

  const toggleSlot = (day, time) => {
    setAvailabilityState((prev) => {
      const current = prev[day] || []
      const has = current.includes(time)
      const next = has ? current.filter((t) => t !== time) : [...current, time]
      return { ...prev, [day]: next }
    })
    setSavedJustNow(false)
  }

  const toggleWholeDay = (day) => {
    setAvailabilityState((prev) => {
      const current = prev[day] || []
      const allOn = current.length === TIME_SLOTS.length
      return { ...prev, [day]: allOn ? [] : [...TIME_SLOTS] }
    })
    setSavedJustNow(false)
  }

  const saveAvailability = async () => {
    setSavingAvailability(true)
    try {
      await setAvailability(DEMO_WORKER.id, availability)
      setSavedJustNow(true)
    } finally {
      setSavingAvailability(false)
    }
  }

  const requested = jobs.filter((j) => j.status === 'Requested')
  const myJobs = jobs.filter((j) => !['Requested', 'Rejected', 'Cancelled'].includes(j.status))

  const todaysJobs = myJobs.filter((j) => j.status !== 'Completed').length
  const todaysEarnings = jobs.filter((j) => j.status === 'Completed').reduce((s, j) => s + j.earnings, 0)
  const maxEarning = Math.max(...EARNINGS_WEEK)

  const nextStatus = { Accepted: 'In Progress', 'In Progress': 'Completed' }

  return (
    <div className="container-app py-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-navy-500 flex items-center justify-center text-white font-display font-bold text-xl">RK</div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display font-bold text-2xl text-navy-700">{DEMO_WORKER.name}</h1>
            <ShieldCheck size={18} className="text-coop-500" />
          </div>
          <p className="text-coop-600 font-semibold text-sm">{DEMO_WORKER.skill} &middot; {DEMO_WORKER.cooperative}</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-navy-400 text-sm mb-6"><Loader2 size={16} className="animate-spin" /> Loading jobs...</div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Briefcase} label="Today's Jobs" value={todaysJobs} color="navy" />
        <StatCard icon={IndianRupee} label="Today's Earnings" value={`₹${todaysEarnings || 0}`} color="coop" />
        <StatCard icon={CalendarClock} label="Upcoming Jobs" value={requested.length} color="saffron" />
        <StatCard icon={Star} label="Customer Rating" value={DEMO_WORKER.rating.toFixed(1)} color="navy" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Job Requests */}
          <div>
            <p className="font-display font-bold text-navy-700 mb-3">Job Requests</p>
            {requested.length === 0 ? (
              <div className="card p-6 text-sm text-navy-400">No new job requests right now.</div>
            ) : (
              <div className="space-y-3">
                {requested.map((j) => (
                  <div key={j.id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm text-navy-700">{j.service} &middot; {j.customer}</p>
                      <p className="text-xs text-navy-400 mt-1">{j.location} &middot; {j.date} at {j.time} &middot; {j.distance} km away</p>
                      <p className="text-xs font-semibold text-coop-600 mt-1">Estimated earnings: ₹{j.earnings}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="secondary" onClick={() => updateStatus(j.id, 'Accepted')}><Check size={14} /> Accept</Button>
                      <Button variant="outline" onClick={() => updateStatus(j.id, 'Rejected')}><X size={14} /> Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Jobs */}
          <div>
            <p className="font-display font-bold text-navy-700 mb-3">My Jobs</p>
            {myJobs.length === 0 ? (
              <div className="card p-6 text-sm text-navy-400">No active jobs. Accept a request to get started.</div>
            ) : (
              <div className="space-y-3">
                {myJobs.map((j) => (
                  <div key={j.id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-navy-700">{j.service} &middot; {j.customer}</p>
                        <StatusPill status={j.status} />
                      </div>
                      <p className="text-xs text-navy-400 mt-1">{j.location} &middot; {j.date} at {j.time}</p>
                    </div>
                    {nextStatus[j.status] && (
                      <Button variant="primary" onClick={() => updateStatus(j.id, nextStatus[j.status])}>
                        Mark as {nextStatus[j.status]}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Earnings chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-1">
              <p className="font-display font-bold text-navy-700">Earnings</p>
              <TrendingUp size={18} className="text-coop-500" />
            </div>
            <div className="grid grid-cols-3 gap-4 my-4 text-center">
              <div>
                <p className="text-xs text-navy-300">This Week</p>
                <p className="font-display font-bold text-navy-700">₹{EARNINGS_WEEK.reduce((a, b) => a + b, 0)}</p>
              </div>
              <div>
                <p className="text-xs text-navy-300">This Month</p>
                <p className="font-display font-bold text-navy-700">₹{EARNINGS_WEEK.reduce((a, b) => a + b, 0) * 4}</p>
              </div>
              <div>
                <p className="text-xs text-navy-300">Total Earnings</p>
                <p className="font-display font-bold text-navy-700">₹{(EARNINGS_WEEK.reduce((a, b) => a + b, 0) * 4 * 9).toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="flex items-end gap-3 h-36 mt-4">
              {EARNINGS_WEEK.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full bg-coop-400 hover:bg-coop-500 transition-colors rounded-t-md"
                    style={{ height: `${(v / maxEarning) * 100}%` }}
                    title={`₹${v}`}
                  />
                  <span className="text-[11px] text-navy-300">{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* My Availability */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-navy-500" />
                <p className="font-display font-bold text-navy-700">My Availability</p>
              </div>
              <Button variant="secondary" onClick={saveAvailability} disabled={savingAvailability || !availability}>
                <Save size={14} /> {savingAvailability ? 'Saving...' : savedJustNow ? 'Saved' : 'Save Availability'}
              </Button>
            </div>
            <p className="text-xs text-navy-400 mb-4">
              Working part-time? Toggle off the days or slots you're not available for — customers will only be able to book you during the slots you keep on.
            </p>

            {!availability ? (
              <div className="flex items-center gap-2 text-navy-400 text-sm py-6"><Loader2 size={16} className="animate-spin" /> Loading availability...</div>
            ) : (
              <div className="overflow-x-auto -mx-1 px-1">
                <table className="w-full text-xs border-separate border-spacing-1 min-w-[560px]">
                  <thead>
                    <tr>
                      <th className="text-left font-semibold text-navy-500 pr-2 w-16">Day</th>
                      {TIME_SLOTS.map((t) => (
                        <th key={t} className="font-semibold text-navy-400 font-normal pb-1 whitespace-nowrap px-1">{t}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {WEEK_DAYS.map((day) => {
                      const daySlots = availability[day] || []
                      const allOn = daySlots.length === TIME_SLOTS.length
                      return (
                        <tr key={day}>
                          <td className="pr-2">
                            <button
                              onClick={() => toggleWholeDay(day)}
                              className={`w-full text-left font-bold px-2 py-1.5 rounded-lg transition-colors ${
                                allOn ? 'text-coop-700 bg-coop-50' : daySlots.length === 0 ? 'text-navy-300' : 'text-navy-600'
                              }`}
                              title="Toggle whole day"
                            >
                              {day}
                            </button>
                          </td>
                          {TIME_SLOTS.map((time) => {
                            const on = daySlots.includes(time)
                            return (
                              <td key={time} className="text-center px-1">
                                <button
                                  onClick={() => toggleSlot(day, time)}
                                  className={`w-8 h-8 rounded-lg border-2 transition-colors ${
                                    on ? 'bg-coop-500 border-coop-500' : 'bg-white border-navy-100 hover:border-navy-200'
                                  }`}
                                  aria-label={`${day} ${time} ${on ? 'available' : 'unavailable'}`}
                                />
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Worker Welfare */}
          <div className="card p-5 border-2 border-coop-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-coop-500 text-white flex items-center justify-center"><HeartHandshake size={17} /></div>
              <p className="font-display font-bold text-navy-700">Worker Welfare</p>
            </div>
            <div className="space-y-3 text-sm">
              <Row label="Insurance" value={<Badge color="coop">{WELFARE_INFO.insuranceStatus}</Badge>} />
              <Row label="Coverage" value={`₹${WELFARE_INFO.coverage.toLocaleString('en-IN')}`} />
              <Row label="Welfare Fund" value={`₹${WELFARE_INFO.welfareFund.toLocaleString('en-IN')}`} />
              <Row label="Cooperative Membership" value={<Badge color="coop">{WELFARE_INFO.membershipStatus}</Badge>} />
              <Row label="Emergency Support" value={<Badge color="saffron">{WELFARE_INFO.emergencySupport}</Badge>} />
            </div>
            <Button variant="secondary" className="w-full mt-4"><ShieldPlus size={15} /> View Welfare Benefits</Button>
            <p className="text-[11px] text-navy-300 mt-3 text-center">Prototype values for demonstration only.</p>
          </div>

          <div className="card p-5">
            <p className="font-display font-bold text-navy-700 mb-3">Support</p>
            <button className="w-full flex items-center gap-2 text-sm text-navy-600 hover:bg-navy-50 rounded-lg px-3 py-2.5">
              <PhoneCall size={16} className="text-coop-500" /> Cooperative Helpline
            </button>
            <button className="w-full flex items-center gap-2 text-sm text-navy-600 hover:bg-navy-50 rounded-lg px-3 py-2.5">
              <Wallet size={16} className="text-coop-500" /> Withdraw Earnings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-navy-400">{label}</span>
      <span className="font-semibold text-navy-700">{value}</span>
    </div>
  )
}
