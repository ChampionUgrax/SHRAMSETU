import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Briefcase, ShieldCheck, BadgeCheck, Building2, AlertTriangle, ArrowLeft } from 'lucide-react'
import { WORKERS } from '../data/mockData'
import { Button, RatingStars, Badge } from '../components/UI'

export default function ServiceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const worker = WORKERS.find((w) => w.id === id) || WORKERS[0]
  const initials = worker.name.split(' ').map((n) => n[0]).join('').slice(0, 2)

  return (
    <div className="container-app py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-navy-400 hover:text-navy-600 mb-5">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-display font-bold text-2xl shrink-0" style={{ backgroundColor: worker.avatarColor }}>
                {initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-bold text-2xl text-navy-700">{worker.name}</h1>
                  {worker.verified && <ShieldCheck size={18} className="text-coop-500" />}
                </div>
                <p className="text-coop-600 font-semibold">{worker.skill}</p>
                <div className="flex items-center gap-3 mt-2 text-sm text-navy-400 flex-wrap">
                  <RatingStars rating={worker.rating} />
                  <span className="flex items-center gap-1"><Briefcase size={14} /> {worker.experience} yrs experience</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {worker.location} ({worker.distance} km)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {worker.verified && <Badge color="coop"><ShieldCheck size={12} /> Identity Verified</Badge>}
              {worker.skillCertified && <Badge color="navy"><BadgeCheck size={12} /> Skill Certified</Badge>}
              {worker.coopVerified && <Badge color="saffron"><Building2 size={12} /> Cooperative Verified</Badge>}
            </div>
          </div>

          <div className="card p-6">
            <p className="font-display font-bold text-navy-700 mb-3">About</p>
            <p className="text-sm text-navy-500 leading-relaxed">
              {worker.name} is a cooperative-registered {worker.skill.toLowerCase()} with {worker.experience} years of experience and {worker.jobsCompleted} completed jobs through {worker.cooperative}. All work is backed by cooperative verification and worker welfare protections.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
              <div>
                <p className="text-xs text-navy-300">Jobs Completed</p>
                <p className="font-display font-bold text-navy-700">{worker.jobsCompleted}</p>
              </div>
              <div>
                <p className="text-xs text-navy-300">Cooperative</p>
                <p className="font-semibold text-navy-700 text-sm">{worker.cooperative}</p>
              </div>
              <div>
                <p className="text-xs text-navy-300">Starting Price</p>
                <p className="font-display font-bold text-navy-700">₹{worker.price}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <p className="font-display font-bold text-navy-700 mb-3">Certifications</p>
            <div className="flex flex-wrap gap-2">
              {worker.certifications.map((c) => (
                <Badge key={c} color="navy"><BadgeCheck size={12} /> {c}</Badge>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <p className="font-display font-bold text-navy-700 mb-4">Reviews ({worker.reviews.length})</p>
            <div className="space-y-4">
              {worker.reviews.map((r, i) => (
                <div key={i} className="border-t border-navy-50 pt-4 first:border-t-0 first:pt-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-navy-700">{r.customer}</p>
                    <RatingStars rating={r.rating} size={13} />
                  </div>
                  <p className="text-sm text-navy-400 mt-1">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 lg:sticky lg:top-20">
            <p className="text-xs text-navy-300">Starting Price</p>
            <p className="font-display font-bold text-3xl text-navy-700">₹{worker.price}</p>
            <p className={`text-sm font-semibold mt-2 ${worker.availability.includes('Today') ? 'text-coop-600' : 'text-saffron-600'}`}>
              {worker.availability}
            </p>
            <div className="flex flex-col gap-3 mt-5">
              <Link to={`/booking?workerId=${worker.id}`}>
                <Button variant="primary" className="w-full">Book Service</Button>
              </Link>
              <Link to={`/booking?workerId=${worker.id}&emergency=1`}>
                <Button variant="accent" className="w-full"><AlertTriangle size={15} /> Emergency Booking</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
