import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Locate, AlertTriangle, Star, Clock, X } from 'lucide-react'
import * as Icons from 'lucide-react'
import { Button, RatingStars, Badge, Modal } from '../components/UI'
import { NEARBY_WORKERS, EMERGENCY_TYPES, WORKERS } from '../data/mockData'

const FILTERS = ['All', 'Electrical', 'Plumbing', 'Carpentry', 'Cleaning']

export default function Nearby() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [emergencyType, setEmergencyType] = useState(null)
  const [searched, setSearched] = useState(false)

  const filtered = useMemo(() => {
    if (filter === 'All') return NEARBY_WORKERS
    return NEARBY_WORKERS.filter((w) => w.category === filter.toLowerCase())
  }, [filter])

  const nearestForEmergency = emergencyType
    ? WORKERS.filter((w) => w.category === emergencyType.category).sort((a, b) => a.distance - b.distance)[0]
    : null

  return (
    <div className="container-app py-8">
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-navy-700">Nearby Verified Workers</h1>
      <p className="text-navy-400 text-sm mt-1">Geo-spatial matching within your service area</p>

      {/* Emergency Services */}
      <div className="card p-5 mt-6 border-2 border-red-100">
        <p className="font-display font-bold text-navy-700 mb-1 flex items-center gap-2"><AlertTriangle size={18} className="text-red-500" /> Emergency Services</p>
        <p className="text-xs text-navy-400 mb-4">Request an urgent verified worker for critical situations</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {EMERGENCY_TYPES.map((e) => {
            const Icon = Icons[e.icon] || AlertTriangle
            return (
              <button
                key={e.id}
                onClick={() => setEmergencyType(e)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-navy-100 hover:border-red-300 hover:bg-red-50 transition-colors"
              >
                <Icon size={20} className="text-red-500" />
                <span className="text-xs font-semibold text-navy-600 text-center">{e.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Filters + Find nearby */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap ${filter === f ? 'bg-navy-500 text-white' : 'bg-white text-navy-500 border border-navy-100'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <Button variant="secondary" onClick={() => setSearched(true)}>
          <Locate size={16} /> Find Workers Near Me
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-5">
        {/* Stylized map */}
        <div className="lg:col-span-2">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border border-navy-100 bg-gradient-to-br from-navy-50 to-coop-50">
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#c9d3e6 1px, transparent 1px), linear-gradient(90deg, #c9d3e6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            {/* Customer location (center) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-navy-600 border-4 border-white shadow-lg animate-pulse-soft" />
              <span className="text-[10px] font-bold text-navy-600 bg-white px-1.5 py-0.5 rounded mt-1 shadow">You</span>
            </div>

            {filtered.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelected(w)}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                style={{ top: `${w.top}%`, left: `${w.left}%` }}
              >
                <div className="w-9 h-9 rounded-full bg-coop-500 group-hover:bg-saffron-500 border-2 border-white shadow-lg flex items-center justify-center text-white transition-colors">
                  <MapPin size={16} />
                </div>
                <span className="text-[10px] font-semibold text-navy-700 bg-white px-1.5 py-0.5 rounded mt-1 shadow whitespace-nowrap">{w.skill} · {w.distance}km</span>
              </button>
            ))}
          </div>
          {searched && (
            <p className="text-xs text-coop-600 font-semibold mt-2 animate-fade-up">Showing {filtered.length} verified workers within 5 km of your location.</p>
          )}
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.map((w) => (
            <button key={w.id} onClick={() => setSelected(w)} className="card p-4 w-full text-left flex items-center justify-between hover:border-coop-300">
              <div>
                <p className="font-semibold text-sm text-navy-700">{w.name}</p>
                <p className="text-xs text-coop-600">{w.skill}</p>
                <RatingStars rating={w.rating} size={11} />
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-navy-400 flex items-center gap-1 justify-end"><MapPin size={12} /> {w.distance} km</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected worker modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        footer={<Button variant="primary" onClick={() => navigate(`/booking?workerId=${WORKERS.find(w=>w.name===selected?.name)?.id || 'w1'}`)}>Book Now</Button>}
      >
        {selected && (
          <div className="space-y-2 text-sm">
            <p className="text-coop-600 font-semibold">{selected.skill}</p>
            <div className="flex items-center gap-3 text-navy-500">
              <RatingStars rating={selected.rating} />
              <span className="flex items-center gap-1"><MapPin size={13} /> {selected.distance} km away</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Emergency modal */}
      <Modal
        open={!!emergencyType}
        onClose={() => setEmergencyType(null)}
        title={emergencyType?.name}
        footer={
          <Button variant="accent" onClick={() => navigate(`/booking?workerId=${nearestForEmergency?.id || 'w1'}&emergency=1`)}>
            Request Emergency Service
          </Button>
        }
      >
        {nearestForEmergency && (
          <div className="space-y-3 text-sm">
            <p className="text-navy-500">Nearest verified worker for this emergency:</p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-50">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: nearestForEmergency.avatarColor }}>
                {nearestForEmergency.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-navy-700">{nearestForEmergency.name}</p>
                <RatingStars rating={nearestForEmergency.rating} size={12} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><p className="text-xs text-navy-300">Distance</p><p className="font-bold text-navy-700">{nearestForEmergency.distance} km</p></div>
              <div><p className="text-xs text-navy-300">ETA</p><p className="font-bold text-navy-700">{Math.round(nearestForEmergency.distance * 6)} min</p></div>
              <div><p className="text-xs text-navy-300">Est. Cost</p><p className="font-bold text-navy-700">₹{nearestForEmergency.price + 100}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
