import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, AlertTriangle, X } from 'lucide-react'
import WorkerCard from '../components/WorkerCard'
import { WORKERS, CATEGORIES } from '../data/mockData'

export default function Services() {
  const [params, setParams] = useSearchParams()
  const initialCategory = params.get('category') || 'all'

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const [minRating, setMinRating] = useState(0)
  const [maxPrice, setMaxPrice] = useState(500)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [location, setLocation] = useState('')
  const [emergency, setEmergency] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return WORKERS.filter((w) => {
      if (category !== 'all' && w.category !== category) return false
      if (query && !(`${w.name} ${w.skill}`.toLowerCase().includes(query.toLowerCase()))) return false
      if (w.rating < minRating) return false
      if (w.price > maxPrice) return false
      if (availableOnly && !w.availability.includes('Today')) return false
      if (location && !w.location.toLowerCase().includes(location.toLowerCase())) return false
      return true
    })
  }, [query, category, minRating, maxPrice, availableOnly, location])

  const setCategoryAndUrl = (id) => {
    setCategory(id)
    setParams(id === 'all' ? {} : { category: id })
  }

  return (
    <div className="container-app py-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-navy-700">Service Marketplace</h1>
        <p className="text-navy-400 text-sm mt-1">{filtered.length} verified cooperative workers found</p>
      </div>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or skill (e.g. Electrician)"
            className="input-field pl-10"
          />
        </div>
        <div className="relative sm:w-56">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="input-field"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="btn-outline sm:w-auto"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {/* Emergency toggle */}
      <button
        onClick={() => setEmergency((v) => !v)}
        className={`w-full sm:w-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold mb-5 transition-colors ${
          emergency ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'
        }`}
      >
        <AlertTriangle size={16} /> Emergency Service {emergency ? '(showing today-only workers)' : ''}
      </button>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Category filter rail */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="card p-4">
            <p className="font-semibold text-sm text-navy-700 mb-3">Category</p>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <button
                onClick={() => setCategoryAndUrl('all')}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${category === 'all' ? 'bg-navy-500 text-white' : 'text-navy-500 hover:bg-navy-50'}`}
              >
                All Services
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryAndUrl(c.id)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${category === c.id ? 'bg-navy-500 text-white' : 'text-navy-500 hover:bg-navy-50'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {showFilters && (
            <div className="card p-4 space-y-5 animate-fade-up">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm text-navy-700">Filters</p>
                <button onClick={() => setShowFilters(false)} className="text-navy-300"><X size={16} /></button>
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-500 mb-2">Minimum Rating: {minRating.toFixed(1)}+</p>
                <input type="range" min="0" max="5" step="0.5" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="w-full accent-coop-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-500 mb-2">Max Price: ₹{maxPrice}</p>
                <input type="range" min="100" max="500" step="10" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-coop-500" />
              </div>
              <label className="flex items-center gap-2 text-sm text-navy-600">
                <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="accent-coop-500 w-4 h-4" />
                Available today only
              </label>
            </div>
          )}
        </aside>

        {/* Results */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="card p-10 text-center text-navy-400">
              No workers match your filters. Try adjusting your search.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((w) => (
                <WorkerCard key={w.id} worker={w} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
