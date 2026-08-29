import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck, IndianRupee, Heart, Bell, Star, RotateCcw, Eye, Loader2 } from 'lucide-react'
import { StatCard, Button, StatusPill, Modal, RatingStars } from '../components/UI'
import { WORKERS } from '../data/mockData'
import { listBookings, submitRating as submitRatingApi, listNotifications } from '../api'

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [rateTarget, setRateTarget] = useState(null)
  const [ratingValue, setRatingValue] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const favourites = WORKERS.slice(0, 3)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [b, n] = await Promise.all([listBookings(), listNotifications()])
      if (!cancelled) {
        setBookings(b)
        setNotifications(n)
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const upcoming = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'In Progress')
  const previous = bookings.filter((b) => b.status === 'Completed' || b.status === 'Cancelled')
  const totalSpend = bookings.reduce((sum, b) => sum + (b.amount || 0), 0)

  const submitRating = async () => {
    setSubmitting(true)
    try {
      await submitRatingApi({ bookingId: rateTarget.id, worker: rateTarget.workerName, rating: ratingValue, review: reviewText })
      setRateTarget(null)
      setReviewText('')
      setRatingValue(5)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-app py-8">
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-navy-700">Customer Dashboard</h1>
      <p className="text-navy-400 text-sm mt-1">Manage your bookings, favourites and spending</p>

      {loading ? (
        <div className="flex items-center gap-2 text-navy-400 text-sm mt-8"><Loader2 size={16} className="animate-spin" /> Loading your dashboard...</div>
      ) : (
      <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard icon={CalendarCheck} label="Upcoming Bookings" value={upcoming.length} color="navy" />
        <StatCard icon={IndianRupee} label="Total Spending" value={`₹${totalSpend}`} color="coop" />
        <StatCard icon={Heart} label="Saved Workers" value={favourites.length} color="saffron" />
        <StatCard icon={Bell} label="Active Requests" value={bookings.filter((b) => b.status === 'In Progress').length} color="navy" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <p className="font-display font-bold text-navy-700 mb-3">Upcoming Bookings</p>
            {upcoming.length === 0 ? (
              <div className="card p-6 text-sm text-navy-400">No upcoming bookings. <button onClick={() => navigate('/services')} className="text-coop-600 font-semibold hover:underline">Book a service</button></div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((b) => <BookingRow key={b.id} b={b} />)}
              </div>
            )}
          </div>

          <div>
            <p className="font-display font-bold text-navy-700 mb-3">Previous Bookings</p>
            <div className="space-y-3">
              {previous.map((b) => (
                <div key={b.id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-navy-700">{b.service}</p>
                      <StatusPill status={b.status} />
                    </div>
                    <p className="text-xs text-navy-400 mt-1">{b.workerName} &middot; {b.date} &middot; {b.time}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" onClick={() => navigate('/services')}><RotateCcw size={14} /> Book Again</Button>
                    {b.status === 'Completed' && (
                      <Button variant="outline" onClick={() => setRateTarget(b)}><Star size={14} /> Rate</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <p className="font-display font-bold text-navy-700 mb-3">Saved Workers</p>
            <div className="space-y-3">
              {favourites.map((w) => (
                <div key={w.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: w.avatarColor }}>
                    {w.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-700 truncate">{w.name}</p>
                    <RatingStars rating={w.rating} size={11} />
                  </div>
                  <Button variant="ghost" className="!px-2 !py-1" onClick={() => navigate(`/service/${w.id}`)}><Eye size={14} /></Button>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="font-display font-bold text-navy-700 mb-3">Notifications</p>
            <div className="space-y-3">
              {notifications.slice(0, 4).map((n) => (
                <div key={n.id} className="text-sm">
                  <p className="text-navy-600">{n.text}</p>
                  <p className="text-xs text-navy-300">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>
      )}

      <Modal
        open={!!rateTarget}
        onClose={() => setRateTarget(null)}
        title={`Rate ${rateTarget?.workerName || ''}`}
        footer={<Button variant="secondary" onClick={submitRating} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Rating'}</Button>}
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-navy-600 mb-2">Overall Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRatingValue(n)}>
                  <Star size={26} className={n <= ratingValue ? 'fill-saffron-400 text-saffron-400' : 'fill-gray-200 text-gray-200'} />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience — service quality, punctuality, professionalism..."
            rows={3}
            className="input-field resize-none"
          />
        </div>
      </Modal>
    </div>
  )
}

function BookingRow({ b }) {
  return (
    <div className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-sm text-navy-700">{b.service}</p>
          <StatusPill status={b.status} />
        </div>
        <p className="text-xs text-navy-400 mt-1">{b.workerName} &middot; {b.date} &middot; {b.time}</p>
        <p className="text-xs text-navy-300 mt-0.5">{b.address}</p>
      </div>
      <p className="font-display font-bold text-navy-700">₹{b.amount}</p>
    </div>
  )
}
