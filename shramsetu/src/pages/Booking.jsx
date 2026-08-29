import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Check, Smartphone, CreditCard, Banknote, MapPin, Zap, CheckCircle2,
  Loader2, X, RefreshCw,
} from 'lucide-react'
import { WORKERS, SERVICES_MENU, TIME_SLOTS, WEEK_DAYS } from '../data/mockData'
import { Button } from '../components/UI'
import { createBooking, getAvailability, createJobRequest, getJobById, updateJobStatus } from '../api'

const STEPS = ['Service', 'Slot', 'Address', 'Payment', 'Confirm']

function weekDayKey(d) {
  // JS getDay(): 0=Sun..6=Sat. WEEK_DAYS is Mon-first, so shift by 6 (mod 7).
  return WEEK_DAYS[(d.getDay() + 6) % 7]
}

function nextDays(n) {
  const days = []
  for (let i = 0; i < n; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    days.push(d)
  }
  return days
}

function dateTabLabel(d, i) {
  if (i === 0) return 'Today'
  if (i === 1) return 'Tomorrow'
  return d.toLocaleDateString('en-IN', { weekday: 'short' })
}

// Roughly mirrors a quick-commerce style slot picker: date tabs up top,
// a horizontal strip of time chips below, with the earliest slot flagged
// as "Fastest" and pre-selected by default. Days/times are filtered down
// to whatever the worker has actually marked available.
function SlotPicker({ days, selectedDayIdx, setSelectedDayIdx, time, setTime, availability }) {
  const isToday = selectedDayIdx === 0
  const now = new Date()
  const selectedDay = days[selectedDayIdx]
  const availableTimesToday = availability[weekDayKey(selectedDay)] || []

  const fastestIdx = useMemo(() => {
    if (!isToday) return -1
    const idx = TIME_SLOTS.findIndex((t) => {
      if (!availableTimesToday.includes(t)) return false
      const [, hh, mm, ap] = t.match(/(\d+):(\d+)\s(AM|PM)/)
      let h = parseInt(hh, 10)
      if (ap === 'PM' && h !== 12) h += 12
      if (ap === 'AM' && h === 12) h = 0
      const slot = new Date()
      slot.setHours(h, parseInt(mm, 10), 0, 0)
      return slot.getTime() > now.getTime()
    })
    return idx
  }, [isToday, availableTimesToday])

  return (
    <div>
      <p className="font-semibold text-navy-700 mb-3 flex items-center gap-2"><Zap size={16} /> Choose a slot</p>

      {/* Date tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {days.map((d, i) => {
          const hasAnySlot = (availability[weekDayKey(d)] || []).length > 0
          return (
            <button
              key={d.toDateString()}
              onClick={() => hasAnySlot && setSelectedDayIdx(i)}
              disabled={!hasAnySlot}
              className={`shrink-0 flex flex-col items-center px-4 py-2 rounded-xl border-2 transition-colors ${
                !hasAnySlot
                  ? 'border-navy-50 text-navy-200 cursor-not-allowed opacity-60'
                  : selectedDayIdx === i
                  ? 'border-coop-500 bg-coop-50'
                  : 'border-navy-100 hover:border-navy-200'
              }`}
            >
              <span className={`text-xs font-bold ${selectedDayIdx === i && hasAnySlot ? 'text-coop-700' : hasAnySlot ? 'text-navy-500' : 'text-navy-200'}`}>
                {dateTabLabel(d, i)}
              </span>
              <span className="text-[11px] text-navy-300">{d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </button>
          )
        })}
      </div>

      {/* Time chip strip */}
      {availableTimesToday.length === 0 ? (
        <p className="text-sm text-navy-400 mt-4">This worker has no slots available on this day — try another date.</p>
      ) : (
        <div className="flex gap-2.5 overflow-x-auto pb-1 mt-4 -mx-1 px-1">
          {TIME_SLOTS.filter((t) => availableTimesToday.includes(t)).map((t) => {
            const isFastest = TIME_SLOTS.indexOf(t) === fastestIdx
            const isSelected = time === t
            return (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`relative shrink-0 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'border-coop-500 bg-coop-500 text-white'
                    : isFastest
                    ? 'border-saffron-300 bg-saffron-50 text-saffron-700'
                    : 'border-navy-100 text-navy-600 hover:border-navy-200'
                }`}
              >
                {isFastest && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-saffron-500 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    FASTEST
                  </span>
                )}
                {t}
              </button>
            )
          })}
        </div>
      )}
      <p className="text-xs text-navy-300 mt-3">Only slots this worker has marked available are shown.</p>
    </div>
  )
}

// Rapido-style "searching / waiting for approval" screen: a pulsing radar
// around the worker's avatar while we poll for their Accept/Reject.
function WaitingForApproval({ worker, elapsed, onCancel }) {
  const initials = worker.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="relative w-28 h-28 flex items-center justify-center mb-6">
        <span className="absolute inset-0 rounded-full bg-coop-400/30 animate-radar" />
        <span className="absolute inset-0 rounded-full bg-coop-400/30 animate-radar" style={{ animationDelay: '0.6s' }} />
        <span className="absolute inset-0 rounded-full bg-coop-400/30 animate-radar" style={{ animationDelay: '1.2s' }} />
        <div
          className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white font-display font-bold text-xl"
          style={{ backgroundColor: worker.avatarColor }}
        >
          {initials}
        </div>
      </div>
      <p className="font-display font-bold text-lg text-navy-700">Requesting {worker.name}...</p>
      <p className="text-sm text-navy-400 mt-1">Waiting for them to accept your booking</p>
      <p className="text-xs text-navy-300 mt-3">{elapsed}s elapsed</p>
      <Button variant="ghost" className="mt-6" onClick={onCancel}>Cancel Request</Button>
    </div>
  )
}

function DeclinedScreen({ worker, onRetry, onFindAnother }) {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
        <X size={28} />
      </div>
      <p className="font-display font-bold text-lg text-navy-700">{worker.name} isn't available right now</p>
      <p className="text-sm text-navy-400 mt-1 max-w-xs">Your request was declined. You can try requesting again or pick a different worker.</p>
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onRetry}><RefreshCw size={14} /> Request Again</Button>
        <Button variant="primary" onClick={onFindAnother}>Find Another Worker</Button>
      </div>
    </div>
  )
}

export default function Booking() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const workerId = params.get('workerId') || WORKERS[0].id
  const worker = WORKERS.find((w) => w.id === workerId) || WORKERS[0]
  const isEmergency = params.get('emergency') === '1'

  const [step, setStep] = useState(0)
  const [service, setService] = useState(null)
  const [selectedDayIdx, setSelectedDayIdx] = useState(0)
  const [time, setTime] = useState(null)
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState(null)
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [availability, setAvailabilityState] = useState(null)

  // Approval flow state: 'form' | 'waiting' | 'declined' | 'confirmed'
  const [phase, setPhase] = useState('form')
  const [jobId, setJobId] = useState(null)
  const [elapsed, setElapsed] = useState(0)

  const availableServices = useMemo(
    () => SERVICES_MENU.filter((s) => s.category === worker.category),
    [worker]
  )

  useEffect(() => {
    if (availableServices.length && !service) setService(availableServices[0])
  }, [availableServices, service])

  const days = useMemo(() => nextDays(7), [])

  useEffect(() => {
    let cancelled = false
    getAvailability(worker.id).then((data) => {
      if (cancelled) return
      setAvailabilityState(data)
      const firstOpenIdx = days.findIndex((d) => (data[weekDayKey(d)] || []).length > 0)
      if (firstOpenIdx !== -1) setSelectedDayIdx(firstOpenIdx)
    })
    return () => { cancelled = true }
  }, [worker.id, days])

  const date = days[selectedDayIdx]
  const amount = (service?.basePrice || worker.price) + (isEmergency ? 100 : 0)

  const canNext = () => {
    if (step === 0) return !!service
    if (step === 1) return !!time
    if (step === 2) return address.trim().length > 3
    if (step === 3) return !!payment
    return true
  }

  // --- Approval flow ---

  const handleRequestWorker = async () => {
    setSubmitting(true)
    try {
      const job = await createJobRequest({
        workerId: worker.id,
        customer: 'You',
        service: service?.name,
        location: address,
        date: date?.toDateString(),
        time,
        distance: worker.distance,
        earnings: amount,
      })
      setJobId(job.id)
      setPhase('waiting')
    } finally {
      setSubmitting(false)
    }
  }

  const finalizeBooking = async () => {
    const booking = await createBooking({
      workerId: worker.id,
      workerName: worker.name,
      service: service?.name,
      date: date?.toDateString(),
      time,
      address,
      payment,
      amount,
      emergency: isEmergency,
    })
    setConfirmedBooking(booking)
    setPhase('confirmed')
  }

  const handleCancel = async () => {
    if (jobId) await updateJobStatus(jobId, 'Cancelled')
    setJobId(null)
    setPhase('form')
  }

  const handleRetry = () => {
    setPhase('form')
    setJobId(null)
    handleRequestWorker()
  }

  // Poll the job's status while waiting for the worker to act on it
  useEffect(() => {
    if (phase !== 'waiting' || !jobId) return
    const interval = setInterval(async () => {
      const job = await getJobById(jobId)
      if (!job) return
      if (['Accepted', 'In Progress', 'Completed'].includes(job.status)) {
        clearInterval(interval)
        finalizeBooking()
      } else if (job.status === 'Rejected') {
        clearInterval(interval)
        setPhase('declined')
      }
    }, 1500)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, jobId])

  // Elapsed-time ticker for the waiting screen
  useEffect(() => {
    if (phase !== 'waiting') { setElapsed(0); return }
    const t = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  if (phase === 'confirmed' && confirmedBooking) {
    return (
      <div className="container-app py-14 flex justify-center">
        <div className="card p-8 max-w-lg w-full text-center animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-coop-50 text-coop-500 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="font-display font-bold text-2xl text-navy-700">BOOKING CONFIRMED</h2>
          <p className="text-navy-400 text-sm mt-1">{worker.name} accepted your request.</p>

          <div className="text-left bg-navy-50 rounded-xl p-5 mt-6 space-y-2 text-sm">
            <Row label="Booking ID" value={confirmedBooking.id} />
            <Row label="Worker" value={confirmedBooking.workerName} />
            <Row label="Service" value={confirmedBooking.service} />
            <Row label="Date" value={confirmedBooking.date} />
            <Row label="Time" value={confirmedBooking.time} />
            <Row label="Address" value={confirmedBooking.address} />
            <Row label="Amount" value={`₹${confirmedBooking.amount}`} />
            <Row label="Payment Status" value="Paid (Simulated)" />
          </div>

          <Button variant="primary" className="w-full mt-6" onClick={() => navigate('/dashboard')}>
            View My Bookings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-app py-8">
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-navy-700">
        {isEmergency ? 'Emergency Booking' : 'Book a Service'}
      </h1>
      <p className="text-navy-400 text-sm mt-1">with {worker.name} &middot; {worker.skill}</p>

      {phase === 'form' && (
        <div className="flex items-center gap-1 sm:gap-2 mt-6 mb-8 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 sm:gap-2 shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i < step ? 'bg-coop-500 text-white' : i === step ? 'bg-navy-500 text-white' : 'bg-navy-100 text-navy-400'
              }`}>
                {i < step ? <Check size={13} /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${i === step ? 'text-navy-700' : 'text-navy-300'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="w-4 sm:w-8 h-px bg-navy-100" />}
            </div>
          ))}
        </div>
      )}

      <div className="card p-6 max-w-2xl mt-6">
        {phase === 'waiting' && (
          <WaitingForApproval worker={worker} elapsed={elapsed} onCancel={handleCancel} />
        )}

        {phase === 'declined' && (
          <DeclinedScreen worker={worker} onRetry={handleRetry} onFindAnother={() => navigate('/services')} />
        )}

        {phase === 'form' && (
          <>
            {step === 0 && (
              <div>
                <p className="font-semibold text-navy-700 mb-4">Select a service</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {availableServices.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setService(s)}
                      className={`text-left p-4 rounded-xl border-2 transition-colors ${
                        service?.id === s.id ? 'border-coop-500 bg-coop-50' : 'border-navy-100 hover:border-navy-200'
                      }`}
                    >
                      <p className="font-semibold text-sm text-navy-700">{s.name}</p>
                      <p className="text-xs text-navy-400 mt-1">Starting ₹{s.basePrice}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              availability ? (
                <SlotPicker
                  days={days}
                  selectedDayIdx={selectedDayIdx}
                  setSelectedDayIdx={(i) => { setSelectedDayIdx(i); setTime(null) }}
                  time={time}
                  setTime={setTime}
                  availability={availability}
                />
              ) : (
                <div className="flex items-center gap-2 text-navy-400 text-sm py-6"><Loader2 size={16} className="animate-spin" /> Checking {worker.name.split(' ')[0]}'s availability...</div>
              )
            )}

            {step === 2 && (
              <div>
                <p className="font-semibold text-navy-700 mb-4 flex items-center gap-2"><MapPin size={16} /> Enter your address</p>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House no, street, area, city, PIN code"
                  rows={4}
                  className="input-field resize-none"
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="font-semibold text-navy-700 mb-4">Select payment method</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { id: 'upi', label: 'UPI', icon: Smartphone },
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'cash', label: 'Cash', icon: Banknote },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPayment(p.label)}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-colors ${
                        payment === p.label ? 'border-coop-500 bg-coop-50' : 'border-navy-100 hover:border-navy-200'
                      }`}
                    >
                      <p.icon size={20} className="text-navy-500" />
                      <span className="text-sm font-semibold text-navy-700">{p.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-navy-300 mt-3">This is a simulated payment for prototype purposes — no real transaction occurs.</p>
              </div>
            )}

            {step === 4 && (
              <div>
                <p className="font-semibold text-navy-700 mb-4">Review your request</p>
                <div className="bg-navy-50 rounded-xl p-5 space-y-2 text-sm">
                  <Row label="Worker" value={worker.name} />
                  <Row label="Service" value={service?.name} />
                  <Row label="Date" value={date?.toDateString()} />
                  <Row label="Time" value={time} />
                  <Row label="Address" value={address} />
                  <Row label="Payment" value={payment} />
                  <Row label="Amount" value={`₹${amount}`} bold />
                </div>
                <p className="text-xs text-navy-300 mt-3">Your request will be sent to {worker.name} to accept — the booking confirms once they approve it.</p>
              </div>
            )}

            <div className="flex justify-between mt-7">
              <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
                Back
              </Button>
              {step < 4 ? (
                <Button variant="primary" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
                  Continue
                </Button>
              ) : (
                <Button variant="secondary" onClick={handleRequestWorker} disabled={submitting}>
                  {submitting ? 'Sending Request...' : 'Request Worker'}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-navy-400">{label}</span>
      <span className={`text-right text-navy-700 ${bold ? 'font-bold' : 'font-medium'}`}>{value}</span>
    </div>
  )
}
