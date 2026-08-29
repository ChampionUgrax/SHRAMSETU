import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Users, CheckCircle2, Building2, Star, ShieldCheck, IndianRupee,
  HeartHandshake, ReceiptText, Lock, Search, Calendar, ThumbsUp, ArrowDown,
} from 'lucide-react'
import ServiceCard from '../components/ServiceCard'
import { Button } from '../components/UI'
import { CATEGORIES } from '../data/mockData'

const STATS = [
  { value: '5,000+', label: 'Verified Workers' },
  { value: '25,000+', label: 'Services Completed' },
  { value: '50+', label: 'Cooperatives' },
  { value: '4.8/5', label: 'Customer Rating' },
]

const WHY = [
  { icon: ShieldCheck, title: 'Verified Workers', desc: 'Identity and skill checks by the cooperative before anyone joins the platform.' },
  { icon: IndianRupee, title: 'Fair Wages', desc: 'Transparent pricing that ensures workers are paid fairly for every job.' },
  { icon: Building2, title: 'Cooperative Owned', desc: 'Owned and governed by labour cooperatives, not private investors.' },
  { icon: ReceiptText, title: 'Transparent Pricing', desc: 'No hidden charges — customers see the full cost before booking.' },
  { icon: HeartHandshake, title: 'Worker Welfare', desc: 'Insurance, welfare fund access and emergency support for every worker.' },
  { icon: Lock, title: 'Secure Payments', desc: 'UPI, card or cash — payments are tracked and protected end to end.' },
]

const STEPS = [
  { icon: Search, title: 'Choose a service', desc: 'Browse categories or search for exactly what you need.' },
  { icon: ShieldCheck, title: 'Find a verified worker', desc: 'Compare ratings, experience and cooperative verification.' },
  { icon: Calendar, title: 'Book a time', desc: 'Pick a date, time and share your address in a few steps.' },
  { icon: CheckCircle2, title: 'Service completed', desc: 'A verified cooperative worker completes the job professionally.' },
  { icon: IndianRupee, title: 'Secure payment', desc: 'Pay via UPI, card or cash — all tracked transparently.' },
  { icon: ThumbsUp, title: 'Give feedback', desc: 'Rate your experience to help the cooperative and community.' },
]

export default function Home() {
  const navigate = useNavigate()
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-500">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="container-app relative py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="section-label bg-white/10 text-coop-200">Cooperative-Owned Marketplace</span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mt-5 leading-tight">
              Skilled Hands. Trusted Services. <span className="text-saffron-300">Stronger Communities.</span>
            </h1>
            <p className="text-navy-100 mt-5 text-lg leading-relaxed max-w-xl">
              A cooperative-powered digital marketplace connecting verified local workers with households and institutions.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button variant="accent" onClick={() => navigate('/services')}>
                Find a Service <ArrowRight size={16} />
              </Button>
              <Button variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-navy-700" onClick={() => navigate('/worker-dashboard')}>
                Become a Worker
              </Button>
            </div>
          </div>

          <div className="animate-fade-up">
            <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur">
              <div className="flex flex-col items-center gap-3">
                <div className="w-full bg-white rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-navy-500 flex items-center justify-center text-white"><Users size={18} /></div>
                  <div>
                    <p className="font-semibold text-navy-700 text-sm">Customer</p>
                    <p className="text-xs text-navy-400">Requests a trusted service</p>
                  </div>
                </div>
                <ArrowDown className="text-coop-300" />
                <div className="w-full bg-coop-500 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white font-display font-bold">S</div>
                  <div>
                    <p className="font-semibold text-white text-sm">ShramSetu</p>
                    <p className="text-xs text-coop-100">Matches with verified worker</p>
                  </div>
                </div>
                <ArrowDown className="text-coop-300" />
                <div className="w-full bg-white rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-saffron-500 flex items-center justify-center text-white"><ShieldCheck size={18} /></div>
                  <div>
                    <p className="font-semibold text-navy-700 text-sm">Verified Worker</p>
                    <p className="text-xs text-navy-400">Delivers the service with quality</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-navy-600">
        <div className="container-app py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display font-extrabold text-2xl sm:text-3xl text-white">{s.value}</p>
              <p className="text-navy-200 text-xs sm:text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-app py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="section-label">Service Categories</span>
          <h2 className="font-display font-bold text-3xl text-navy-700 mt-3">What do you need help with?</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((c) => (
            <ServiceCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="bg-white border-y border-navy-100">
        <div className="container-app py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="section-label">Why ShramSetu?</span>
            <h2 className="font-display font-bold text-3xl text-navy-700 mt-3">Built on trust, fairness and community</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY.map((w) => (
              <div key={w.title} className="card p-6">
                <div className="w-11 h-11 rounded-xl bg-coop-50 text-coop-600 flex items-center justify-center mb-4">
                  <w.icon size={20} />
                </div>
                <p className="font-display font-bold text-navy-700">{w.title}</p>
                <p className="text-sm text-navy-400 mt-1.5 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-app py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="section-label">Simple Process</span>
          <h2 className="font-display font-bold text-3xl text-navy-700 mt-3">How It Works</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card p-6 relative">
              <span className="absolute top-4 right-5 text-3xl font-display font-extrabold text-navy-50">{`0${i + 1}`}</span>
              <div className="w-11 h-11 rounded-xl bg-navy-500 text-white flex items-center justify-center mb-4 relative z-10">
                <s.icon size={19} />
              </div>
              <p className="font-display font-bold text-navy-700 relative z-10">{s.title}</p>
              <p className="text-sm text-navy-400 mt-1.5 leading-relaxed relative z-10">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-navy-600 to-coop-600">
        <div className="container-app py-14 text-center">
          <h2 className="font-display font-extrabold text-3xl text-white">Empowering Workers. Serving Communities.</h2>
          <p className="text-navy-100 mt-3 max-w-xl mx-auto">Join thousands of households and cooperative workers building a fairer local services economy.</p>
          <div className="flex justify-center gap-3 mt-7">
            <Button variant="accent" onClick={() => navigate('/services')}>Find a Service</Button>
            <Button variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-navy-700" onClick={() => navigate('/worker-dashboard')}>Become a Worker</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
