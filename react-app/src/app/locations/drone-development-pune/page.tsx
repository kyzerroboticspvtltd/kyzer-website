import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Drone Development & Manufacturing in Pune | Custom UAV — Kyzer Robotics',
  description: 'Custom drone development in Pune — FPV, agricultural, survey, and surveillance UAVs. Full design, assembly, and testing by the Kyzer Robotics team. Free consultation.',
  keywords: ['drone development Pune', 'drone manufacturer Pune', 'custom drone Pune', 'FPV drone Pune', 'agricultural drone Pune', 'UAV company Pune'],
}

const FAQS = [
  { q: 'Is Kyzer Robotics a drone manufacturer in Pune?', a: 'Yes — we design, assemble, and test custom drones at our Pune workshop. We build FPV racing drones, agricultural sprayers, survey UAVs, and custom payload platforms.' },
  { q: 'Can I get a drone built in Pune within 2 weeks?', a: 'Simple FPV builds can be delivered in 1–2 weeks. Agricultural and survey drones typically take 3–4 weeks from spec confirmation.' },
  { q: 'Do you offer drone repair in Pune?', a: 'Yes — we repair all drone types including crash damage, motor and ESC replacement, and flight controller issues. WhatsApp us a photo of the damage.' },
  { q: 'What types of drones do you build in Pune?', a: 'We build FPV racing/freestyle drones, long-range cruisers, agricultural spray drones (10–25L), survey mapping drones, surveillance drones, and custom payload UAVs.' },
]

export default function Page() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingTop: '80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px 100px' }}>

        <p style={{ color: '#3498db', fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.15em', marginBottom: 16 }}>
          // DRONE DEVELOPMENT · PUNE · INDIA
        </p>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          Drone Development &amp; Manufacturing<br />
          <span style={{ color: '#3498db' }}>in Pune, India</span>
        </h1>
        <p style={{ color: '#aaa', fontSize: 18, maxWidth: 680, lineHeight: 1.8, marginBottom: 40 }}>
          Kyzer Robotics is a Pune-based custom drone manufacturer. We build FPV drones, agricultural sprayers, survey UAVs, and custom payload platforms — fully designed, assembled, tuned, and tested at our Pune workshop.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 60 }}>
          <a href="/consultation" style={{ padding: '14px 28px', background: '#3498db', color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Free Consultation</a>
          <a href="https://wa.me/919049695264" target="_blank" rel="noopener" style={{ padding: '14px 28px', background: '#111', color: '#fff', borderRadius: 8, fontWeight: 600, textDecoration: 'none', border: '1px solid #333' }}>WhatsApp Us</a>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Drone Types We Build in Pune</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 60 }}>
          {[
            { icon: '🏁', title: 'FPV Racing Drones', desc: 'Custom 5" and 3.5" FPV builds with the latest stacks. Betaflight tuned and ready to fly.' },
            { icon: '🌾', title: 'Agricultural Sprayers', desc: '10–25L autonomous spray drones with GPS coverage and variable-rate nozzles.' },
            { icon: '📡', title: 'Survey UAVs', desc: 'Mapping drones with RTK GPS, 4K gimbal, and Mission Planner integration.' },
            { icon: '👁️', title: 'Surveillance Drones', desc: 'Long-endurance thermal and optical payload drones for inspection and monitoring.' },
          ].map(f => (
            <div key={f.title} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <p style={{ fontWeight: 700, marginBottom: 6 }}>{f.title}</p>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 60 }}>
          {FAQS.map(faq => (
            <div key={faq.q} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '20px 24px' }}>
              <p style={{ fontWeight: 700, marginBottom: 8 }}>{faq.q}</p>
              <p style={{ color: '#888', fontSize: 14, lineHeight: 1.7 }}>{faq.a}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/services/drone-development" style={{ color: '#3498db', fontSize: 14 }}>→ Drone Development Service</Link>
          <Link href="/shop/drones" style={{ color: '#3498db', fontSize: 14 }}>→ Shop Drone Parts</Link>
          <Link href="/locations/robotics-company-pune" style={{ color: '#3498db', fontSize: 14 }}>→ Robotics Company Pune</Link>
        </div>
      </div>
    </main>
  )
}
