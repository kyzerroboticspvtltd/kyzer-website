import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Industrial Automation in Pune | MSME Factory Automation — Kyzer Robotics',
  description: 'Industrial automation solutions for Pune manufacturers and MSMEs — robotic arms, conveyor systems, computer vision QC, PLC programming. Free site visit for Pune clients.',
  keywords: ['industrial automation Pune', 'factory automation Pune', 'MSME automation Pune Maharashtra', 'PLC automation Pune', 'robotic automation Pune'],
}

export default function Page() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingTop: '80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px 100px' }}>

        <p style={{ color: '#e67e22', fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.15em', marginBottom: 16 }}>
          // INDUSTRIAL AUTOMATION · PUNE · MAHARASHTRA
        </p>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          Industrial Automation in Pune<br />
          <span style={{ color: '#e67e22' }}>For MSMEs &amp; Manufacturers</span>
        </h1>
        <p style={{ color: '#aaa', fontSize: 18, maxWidth: 680, lineHeight: 1.8, marginBottom: 40 }}>
          Kyzer Robotics provides custom industrial automation solutions for Pune-based manufacturers, MSMEs, and factories. From single robotic pick-and-place cells to full conveyor-and-vision inspection lines — built, installed, and supported by our engineering team.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 60 }}>
          <a href="/consultation" style={{ padding: '14px 28px', background: '#e67e22', color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Book a Free Site Visit</a>
          <a href="https://wa.me/919049695264" target="_blank" rel="noopener" style={{ padding: '14px 28px', background: '#111', color: '#fff', borderRadius: 8, fontWeight: 600, textDecoration: 'none', border: '1px solid #333' }}>WhatsApp Us</a>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 60 }}>
          {[
            { v: '3×', l: 'Throughput gain' },
            { v: '8mo', l: 'Avg ROI period' },
            { v: '0.3%', l: 'Error rate achieved' },
            { v: 'FREE', l: 'Site visit for Pune' },
          ].map(s => (
            <div key={s.l} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '20px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#e67e22', marginBottom: 4 }}>{s.v}</p>
              <p style={{ fontSize: 12, color: '#666' }}>{s.l}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Automation Solutions We Build in Pune</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 60 }}>
          {[
            { icon: '🦾', title: 'Robotic Pick-and-Place', desc: 'Replace manual sorting and assembly with 3–4 DOF robotic arms. Typical payback: 8–12 months.' },
            { icon: '👁️', title: 'Computer Vision Quality Control', desc: 'YOLOv8 edge AI for defect detection, dimensional measurement, and reject decisions at line speed.' },
            { icon: '🏭', title: 'Conveyor Automation', desc: 'Variable-speed conveyor design with PLC sequencing, sensor integration, and reject mechanisms.' },
            { icon: '📟', title: 'PLC Programming & HMI', desc: 'Allen Bradley, Siemens S7, and Arduino PLC programming. HMI design for operator control.' },
            { icon: '📊', title: 'Production Monitoring', desc: 'OEE dashboards, downtime tracking, and production data logging for management reporting.' },
          ].map(f => (
            <div key={f.title} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '20px 24px', display: 'flex', gap: 20 }}>
              <span style={{ fontSize: 28 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>{f.title}</p>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/services/industrial-automation" style={{ color: '#e67e22', fontSize: 14 }}>→ Industrial Automation Service</Link>
          <Link href="/services/robotics-solutions" style={{ color: '#e67e22', fontSize: 14 }}>→ Robotics Solutions</Link>
          <Link href="/locations/robotics-company-pune" style={{ color: '#e67e22', fontSize: 14 }}>→ Robotics Company Pune</Link>
        </div>
      </div>
    </main>
  )
}
