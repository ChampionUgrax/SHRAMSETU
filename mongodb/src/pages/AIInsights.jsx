import React from 'react'
import { Brain, TrendingUp, Lightbulb, Users2, Sparkles } from 'lucide-react'
import { Badge } from '../components/UI'
import { AI_DEMAND_FORECAST, AI_RECOMMENDATIONS } from '../data/mockData'

export default function AIInsights() {
  return (
    <div className="container-app py-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-navy-500 text-white flex items-center justify-center"><Brain size={22} /></div>
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-navy-700">AI Workforce Intelligence</h1>
          <p className="text-navy-400 text-sm mt-0.5">Predict demand and allocate cooperative workers efficiently.</p>
        </div>
      </div>
      <Badge color="saffron" className="mt-4"><Sparkles size={12} /> AI-powered prototype prediction — simulated, not a live ML model</Badge>

      {/* Demand Forecast */}
      <div className="mt-8">
        <p className="font-display font-bold text-navy-700 mb-4 flex items-center gap-2"><TrendingUp size={18} /> Demand Forecast</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AI_DEMAND_FORECAST.map((f) => {
            const max = Math.max(...f.trend)
            return (
              <div key={f.skill} className="card p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-navy-700">{f.skill}</p>
                  <span className="text-coop-600 font-bold text-sm">+{f.change}%</span>
                </div>
                <div className="flex items-end gap-1 h-16 mt-4">
                  {f.trend.map((v, i) => (
                    <div key={i} className="flex-1 bg-navy-100 hover:bg-coop-400 transition-colors rounded-t" style={{ height: `${(v / max) * 100}%` }} />
                  ))}
                </div>
                <p className="text-[11px] text-navy-300 mt-2">Projected demand — next 7 days</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <p className="font-display font-bold text-navy-700 mb-4 flex items-center gap-2"><Lightbulb size={18} /> AI Recommendations</p>
          <div className="space-y-3">
            {AI_RECOMMENDATIONS.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-navy-50">
                <div className="w-6 h-6 rounded-full bg-navy-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
                <p className="text-sm text-navy-600">{r}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <p className="font-display font-bold text-navy-700 mb-4 flex items-center gap-2"><Users2 size={18} /> Workforce Allocation</p>
          <div className="space-y-4">
            {[
              { zone: 'Zone A (Electrical)', pct: 88 },
              { zone: 'Zone B (Caregiving)', pct: 71 },
              { zone: 'Zone C (Plumbing)', pct: 64 },
              { zone: 'Zone D (Cleaning)', pct: 55 },
            ].map((z) => (
              <div key={z.zone}>
                <div className="flex justify-between text-xs text-navy-500 mb-1"><span>{z.zone}</span><span>{z.pct}% allocated</span></div>
                <div className="h-2 rounded-full bg-navy-50 overflow-hidden">
                  <div className="h-full bg-saffron-500 rounded-full" style={{ width: `${z.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-navy-300 mt-4 leading-relaxed">
            This module is structured so a future machine-learning API (demand prediction, dynamic worker allocation) can replace these simulated predictions without changing the interface.
          </p>
        </div>
      </div>
    </div>
  )
}
