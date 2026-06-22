import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Robotics Company in Pune | Custom Robots & Automation — Kyzer Robotics',
  description: 'Kyzer Robotics is a robotics company in Pune building custom robotic arms, autonomous vehicles, AI-integrated robots, and industrial automation systems for students, startups, and industry.',
  keywords: ['robotics company Pune', 'robotics firm Pune', 'custom robot manufacturer Pune', 'robotics startup Pune India', 'automation company Pune'],
}

const SERVICES = [
  { icon: '🤖', title: 'Custom Robotics', desc: '3–6 DOF robotic arms, AGVs, and AI robots built for your specific application.', href: '/services/robotics-solutions' },
  { icon: '🚁', title: 'Drone Development', desc: 'FPV, agricultural, survey, and custom payload UAVs designed and built in Pune.', href: '/services/drone-development' },
  { icon: '⚙️', title: 'Industrial Automation', desc: 'Conveyor systems, computer vision QC, and PLC automation for Pune factories.', href: '/services/industrial-automation' },
  { icon: '🖨️', title: '3D Printing', desc: 'FDM 3D printing in PLA, PETG, Nylon, and Carbon Fibre with 48-hour turnaround.', href: '/services/3d-printing' },
  { icon: '🔌', title: 'PCB Design', desc: 'Schematic to assembled PCB — KiCad design, JLCPCB manufacturing, SMD assembly.', href: '/services/pcb-design' },
  { icon: '💡', title: 'Rapid Prototyping', desc: '48-hour hardware prototypes for startups, engineers, and student teams.', href: '/services/prototyping' },
]

const INFO = [
  { label: 'Company', value: 'Kyzer Robotics Pvt. Ltd.' },
  { label: 'Location', value: 'Ambegaon Pathar, Pune, Maharashtra' },
  { label: 'Founded', value: '2023' },
  { label: 'Specialisation', value: 'Robotics, Drones, Electronics' },
  { label: 'Contact', value: '+91 90496 95264' },
  { label: 'Email', value: 'info@kyzerrobotics.com' },
]

export default function Page() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', color: '#111', paddingTop: '80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px 100px' }}>

        <p style={{ color: '#e74c3c', fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.15em', marginBottom: 16 }}>
          // ROBOTICS COMPANY · PUNE · INDIA
        </p>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          Robotics Company in Pune —<br />
          <span style={{ color: '#e74c3c' }}>Kyzer Robotics</span>
        </h1>
        <p style={{ color: '#888', fontSize: 18, maxWidth: 680, lineHeight: 1.8, marginBottom: 40 }}>
          Kyzer Robotics Pvt. Ltd. is a Pune-based robotics company specialising in custom robotic arms, autonomous ground vehicles, AI-integrated robotics, industrial automation, drone development, and rapid prototyping. We serve students, startups, research labs, and manufacturers across India.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 60 }}>
          <a href="/consultation" style={{ padding: '14px 28px', background: '#e74c3c', color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Talk to Our Team</a>
          <a href="/about" style={{ padding: '14px 28px', background: '#f0f0ee', color: '#111', borderRadius: 8, fontWeight: 600, textDecoration: 'none', border: '1px solid #333' }}>About Kyzer →</a>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>What We Do</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 60 }}>
          {SERVICES.map(f => (
            <a key={f.title} href={f.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 24, height: '100%' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <p style={{ fontWeight: 700, marginBottom: 6, color: '#fff' }}>{f.title}</p>
                <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </a>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '32px 40px', marginBottom: 60 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Kyzer Robotics — Company Info</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
            {INFO.map(i => (
              <div key={i.label}>
                <p style={{ fontSize: 11, color: '#555', letterSpacing: '0.1em', marginBottom: 4 }}>{i.label.toUpperCase()}</p>
                <p style={{ fontSize: 14, color: '#ddd' }}>{i.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/portfolio" style={{ color: '#e74c3c', fontSize: 14 }}>→ View Our Work</Link>
          <Link href="/locations/industrial-automation-pune" style={{ color: '#e74c3c', fontSize: 14 }}>→ Industrial Automation Pune</Link>
          <Link href="/locations/3d-printing-pune" style={{ color: '#e74c3c', fontSize: 14 }}>→ 3D Printing Pune</Link>
        </div>
      </div>
    </main>
  )
}
