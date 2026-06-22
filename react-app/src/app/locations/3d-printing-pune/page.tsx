import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '3D Printing Services in Pune | 48-Hour Turnaround — Kyzer Robotics',
  description: 'Looking for 3D printing in Pune? Kyzer Robotics offers professional FDM 3D printing in Pune with 48-hour turnaround. PLA, PETG, ABS, Nylon, Carbon Fibre. Free quote in 2 hours.',
  keywords: ['3D printing Pune', '3D printing service Pune', '3D print shop Pune', 'FDM printing Pune', '3D printing near me Pune'],
}

const FAQS = [
  { q: 'Where is your 3D printing workshop in Pune?', a: 'We are based in Ambegaon Pathar, Pune, Maharashtra. We offer pickup from our workshop and ship pan-India via courier.' },
  { q: 'How quickly can you deliver 3D printed parts in Pune?', a: 'Most FDM prints are ready within 48 hours of file approval. For local Pune customers, same-day pickup is often possible for smaller parts.' },
  { q: 'What is the cost of 3D printing in Pune?', a: 'Pricing depends on material, print volume, infill, and post-processing. Simple PLA parts start from ₹100. Contact us with your file for an exact quote — usually within 2 hours.' },
  { q: 'Do you offer delivery within Pune?', a: 'Yes — we can arrange local delivery within Pune for bulk orders. For small orders, pickup from Ambegaon Pathar or courier is recommended.' },
]

export default function Page() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', color: '#111', paddingTop: '80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px 100px' }}>

        <p style={{ color: '#FF8C35', fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.15em', marginBottom: 16 }}>
          // 3D PRINTING · PUNE · MAHARASHTRA
        </p>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          3D Printing Services in Pune<br />
          <span style={{ color: '#FF8C35' }}>48-Hour Turnaround</span>
        </h1>
        <p style={{ color: '#888', fontSize: 18, maxWidth: 680, lineHeight: 1.8, marginBottom: 40 }}>
          Kyzer Robotics is Pune&apos;s go-to 3D printing service for engineers, students, startups, and manufacturers. We print in PLA, PETG, ABS, TPU, Nylon, and Carbon Fibre composites — and deliver in 48 hours.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 60 }}>
          <a href="/get-a-quote" style={{ padding: '14px 28px', background: '#FF8C35', color: '#000', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get a Free Quote</a>
          <a href="https://wa.me/919049695264" target="_blank" rel="noopener" style={{ padding: '14px 28px', background: '#f0f0ee', color: '#111', borderRadius: 8, fontWeight: 600, textDecoration: 'none', border: '1px solid #333' }}>WhatsApp Us</a>
        </div>

        {/* Why Kyzer */}
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Why Choose Kyzer Robotics for 3D Printing in Pune?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 60 }}>
          {[
            { icon: '⚡', title: '48-Hour Turnaround', desc: 'Parts ready in 48 hours from file approval. Same-day for urgent jobs.' },
            { icon: '🧱', title: '6+ Materials', desc: 'PLA, PETG, ABS, TPU, Nylon PA12, and Carbon Fibre composite.' },
            { icon: '📍', title: 'Pune Based', desc: 'Workshop in Ambegaon Pathar. Pickup available, or ship nationwide.' },
            { icon: '💰', title: 'Competitive Pricing', desc: 'Honest pricing per gram. Free quote in 2 hours. No hidden charges.' },
          ].map(f => (
            <div key={f.title} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <p style={{ fontWeight: 700, marginBottom: 6 }}>{f.title}</p>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 60 }}>
          {FAQS.map(faq => (
            <div key={faq.q} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '20px 24px' }}>
              <p style={{ fontWeight: 700, marginBottom: 8 }}>{faq.q}</p>
              <p style={{ color: '#888', fontSize: 14, lineHeight: 1.7 }}>{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Related */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/services/3d-printing" style={{ color: '#FF8C35', fontSize: 14 }}>→ 3D Printing Service Page</Link>
          <Link href="/services/prototyping" style={{ color: '#FF8C35', fontSize: 14 }}>→ Rapid Prototyping</Link>
          <Link href="/locations/prototype-manufacturing-india" style={{ color: '#FF8C35', fontSize: 14 }}>→ Prototype Manufacturing India</Link>
        </div>
      </div>
    </main>
  )
}
