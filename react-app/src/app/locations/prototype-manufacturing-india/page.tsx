import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Prototype Manufacturing in India | 48-Hour Hardware Prototypes — Kyzer Robotics',
  description: 'Prototype manufacturing service in India — 3D printing, PCB, CNC, and electronics prototypes shipped anywhere in India within 48–72 hours. Based in Pune, Maharashtra.',
  keywords: ['prototype manufacturing India', 'hardware prototype India', 'rapid prototyping India', '3D printing India', 'electronics prototype India'],
}

export default function Page() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', color: '#111', paddingTop: '80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px 100px' }}>

        <p style={{ color: '#9b59b6', fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.15em', marginBottom: 16 }}>
          // PROTOTYPE MANUFACTURING · INDIA
        </p>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          Prototype Manufacturing in India —<br />
          <span style={{ color: '#9b59b6' }}>48-Hour Delivery Nationwide</span>
        </h1>
        <p style={{ color: '#888', fontSize: 18, maxWidth: 680, lineHeight: 1.8, marginBottom: 40 }}>
          Kyzer Robotics manufactures hardware prototypes from our Pune workshop and ships them anywhere in India within 48–72 hours. 3D printed parts, PCB prototypes, assembled electronics, and mechanical assemblies — all from a single team.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 60 }}>
          <a href="/get-a-quote" style={{ padding: '14px 28px', background: '#9b59b6', color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Start a Prototype</a>
          <a href="/consultation" style={{ padding: '14px 28px', background: '#f0f0ee', color: '#111', borderRadius: 8, fontWeight: 600, textDecoration: 'none', border: '1px solid #333' }}>Book a Consultation</a>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>What We Prototype</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 60 }}>
          {[
            { icon: '🖨️', title: '3D Printed Parts', desc: 'FDM prototypes in PLA, PETG, Nylon, and Carbon Fibre. Functional, accurate, and fast.' },
            { icon: '🔌', title: 'PCB Prototypes', desc: 'Schematic to assembled PCB in 10 days. KiCad design + JLCPCB + SMD assembly.' },
            { icon: '📦', title: 'Product Enclosures', desc: 'Custom enclosures for IoT devices, electronics, and consumer products.' },
            { icon: '🦾', title: 'Robotic Mechanisms', desc: '3D printed and machined mechanical assemblies, brackets, and linkages.' },
            { icon: '🚁', title: 'Drone Frames & Parts', desc: 'Custom drone frames, mounts, and camera rigs printed in CF-PLA or Nylon.' },
            { icon: '💡', title: 'Hardware Startups', desc: 'End-to-end prototype for hardware startups — mechanical + electronics + firmware.' },
          ].map(f => (
            <div key={f.title} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <p style={{ fontWeight: 700, marginBottom: 6 }}>{f.title}</p>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#9b59b6', borderRadius: 16, padding: '40px', textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 12 }}>Shipping Pan-India</h2>
          <p style={{ color: 'rgba(255,255,255,.8)', maxWidth: 500, margin: '0 auto 24px', lineHeight: 1.7 }}>
            We ship to Mumbai, Bangalore, Delhi, Chennai, Hyderabad, and all Indian cities via Blue Dart, Delhivery, and DTDC with full tracking.
          </p>
          <a href="/get-a-quote" style={{ display: 'inline-block', padding: '14px 32px', background: '#fff', color: '#9b59b6', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
            Get a Quote →
          </a>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/services/prototyping" style={{ color: '#9b59b6', fontSize: 14 }}>→ Prototyping Service Page</Link>
          <Link href="/services/3d-printing" style={{ color: '#9b59b6', fontSize: 14 }}>→ 3D Printing Services</Link>
          <Link href="/services/pcb-design" style={{ color: '#9b59b6', fontSize: 14 }}>→ PCB Design</Link>
        </div>
      </div>
    </main>
  )
}
