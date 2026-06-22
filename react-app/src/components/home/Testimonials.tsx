'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Rahul Deshmukh',
    role: 'Formula Student Team Lead',
    org: 'MIT-WPU Racing',
    rating: 5,
    text: 'Kyzer Robotics delivered our carbon fibre drone frame prototypes in under 48 hours. The precision was exactly what we needed for our SAE Aero Design competition. Highly recommended for any student team.',
    emoji: '🏎️',
  },
  {
    name: 'Priya Kulkarni',
    role: 'Founder',
    org: 'AgroTech Solutions',
    rating: 5,
    text: 'We commissioned a custom agricultural survey drone for our farm mapping project. Kyzer handled everything from frame design to flight controller tuning. The results exceeded our expectations.',
    emoji: '🌾',
  },
  {
    name: 'Arjun Nair',
    role: 'Electronics Engineer',
    org: 'Freelance',
    rating: 5,
    text: 'Best place in Pune to source Arduino, ESP32, and drone parts. Same-day availability on most items, and the team actually knows what they're selling. Not just a reseller — real engineers.',
    emoji: '⚡',
  },
  {
    name: 'Sneha Joshi',
    role: 'Product Designer',
    org: 'StartupPune',
    rating: 5,
    text: 'The 3D printing quality is outstanding. Got 10 functional prototype enclosures for our IoT device. Perfect layer adhesion, tight tolerances, and the TPU parts were exactly as spec'd.',
    emoji: '🖨️',
  },
  {
    name: 'Vikram Patil',
    role: 'Professor',
    org: 'VIT Pune',
    rating: 5,
    text: 'We use Kyzer Robotics exclusively for our robotics lab supplies. From Raspberry Pi to custom PCBs — the service is reliable, fast, and the team provides genuine technical guidance.',
    emoji: '🎓',
  },
  {
    name: 'Mohammed Iqbal',
    role: 'FPV Pilot',
    org: 'Pune FPV Community',
    rating: 5,
    text: 'Finally a local drone component shop that stocks quality parts. My 5" freestyle build using their frame, motors, and ESC stack has been flying 6 months without a single component failure.',
    emoji: '🚁',
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const visible = 3
  const total = TESTIMONIALS.length

  function prev() { setCurrent(c => (c - 1 + total) % total) }
  function next() { setCurrent(c => (c + 1) % total) }

  const shown = Array.from({ length: visible }, (_, i) => TESTIMONIALS[(current + i) % total])

  return (
    <section style={{ background: '#111', padding: '80px 24px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,140,53,0.12)', border: '1px solid rgba(255,140,53,0.25)', borderRadius: 20, padding: '6px 16px', marginBottom: 16 }}>
            <Star size={13} color="#FF8C35" fill="#FF8C35" />
            <span style={{ fontSize: 12, color: '#FF8C35', fontWeight: 600, letterSpacing: '0.08em' }}>CUSTOMER STORIES</span>
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 56px)', color: '#fff', margin: '0 0 16px', letterSpacing: '0.04em', lineHeight: 1 }}>
            TRUSTED BY ENGINEERS,<br />
            <span style={{ color: '#FF8C35' }}>STUDENTS & MAKERS</span>
          </h2>
          <p style={{ fontSize: 16, color: '#aaa', maxWidth: 520, margin: '0 auto' }}>
            From FPV builds to industrial prototypes — here&apos;s what our community says.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 36 }}>
          {shown.map((t, i) => (
            <div
              key={`${current}-${i}`}
              style={{
                background: '#1a1a1a', borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.08)',
                padding: 28, position: 'relative',
                transition: 'transform 0.3s, border-color 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = 'rgba(255,140,53,0.3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              }}
            >
              <Quote size={28} color="#FF8C35" style={{ opacity: 0.4, marginBottom: 16 }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} fill={s <= t.rating ? '#FF8C35' : 'none'} stroke="#FF8C35" />
                ))}
              </div>

              <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.75, marginBottom: 24, fontStyle: 'italic' }}>
                &ldquo;{t.text}&rdquo;
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(255,140,53,0.15)', border: '2px solid rgba(255,140,53,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
                }}>
                  {t.emoji}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{t.role} · {t.org}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <button onClick={prev} style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={18} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? 24 : 8, height: 8,
                  borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: i === current ? '#FF8C35' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
          <button onClick={next} style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 60, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 48 }}>
          {[
            { value: '500+', label: 'Orders Delivered' },
            { value: '48hr', label: '3D Print Turnaround' },
            { value: '50+', label: 'Custom Drone Builds' },
            { value: '4.9★', label: 'Average Rating' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#FF8C35', letterSpacing: '0.04em' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#777', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
