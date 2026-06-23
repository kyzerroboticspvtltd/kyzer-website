import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Portfolio — Kyzer Robotics | Drones, 3D Printing & Automation Projects',
  description: 'Explore Kyzer Robotics project portfolio — FPV drones, agricultural UAVs, 3D printed prototypes, industrial automation, and student competition builds from Pune, India.',
  openGraph: { title: 'Portfolio — Kyzer Robotics', description: 'Real builds. Real engineering. See what we\'ve made.' },
}

const PROJECTS = [
  {
    id: 'agri-sprayer', category: 'Drones', tag: 'Agricultural', emoji: '🌾',
    title: 'KZ-Agri Hex Sprayer', client: 'AgroTech Solutions, Nashik', duration: '3 weeks',
    summary: 'Hexacopter precision spray drone for vineyard pesticide application. 10L tank, 15m spray width, GPS-guided row coverage with 94% chemical savings vs. manual spraying.',
    tech: ['Custom CF hexacopter frame', 'Cube Orange flight controller', 'ArduPilot autonomous waypoints', '10L tank + variable-rate nozzles', 'RTK GPS (±2cm accuracy)'],
    outcome: '40 acres/hour coverage rate · 35-min flight time · Deployed across 3 farms', accent: '#2ecc71',
  },
  {
    id: 'fpv-race', category: 'Drones', tag: 'FPV / Racing', emoji: '🏁',
    title: '5" Freestyle FPV Stack', client: 'Pune FPV Community (batch of 12)', duration: '2 weeks',
    summary: 'Batch build of 12 freestyle FPV racing drones for the Pune FPV club. Custom carbon fibre truX frames, soldered 4-in-1 ESC stacks, and full ExpressLRS integration.',
    tech: ['5" CF truX frame (custom cut)', '2207 2450KV motors', '45A BLHeli_32 4-in-1 ESC', 'F7 flight controller', 'ExpressLRS 2.4GHz'],
    outcome: 'All 12 drones bench-tested and tuned · Zero field failures in 6 months of use', accent: '#FF8C35',
  },
  {
    id: 'survey-drone', category: 'Drones', tag: 'Surveillance / Survey', emoji: '📡',
    title: 'KZ-Recon X1 Survey UAV', client: 'Construction firm, Pune', duration: '4 weeks',
    summary: '4K mapping drone with 3-axis gimbal for construction site survey and progress monitoring. Replaces weekly manual survey walks, generates orthomosaic maps and point clouds.',
    tech: ['Custom X8 frame (foldable)', '4K Sony sensor + 3-axis gimbal', 'Mission Planner auto-grid', '35-min flight time (6S LiPo)', 'Real-time live feed 1km range'],
    outcome: 'Survey time cut from 4hr → 45min · Client uses weekly for site reporting', accent: '#3498db',
  },
  {
    id: 'formula-prototype', category: '3D Printing', tag: 'Student Motorsport', emoji: '🏎️',
    title: 'Formula Student Aero Package', client: 'MIT-WPU Racing Team', duration: '5 days',
    summary: 'Full aero package for Formula Student India 2025 — front and rear wing endplates, diffuser fins, nose cone, and undertray components in CF-PLA and Nylon.',
    tech: ['CF-PLA (front wing endplates)', 'PA12 Nylon (undertray)', 'ABS (nose cone internal structure)', '0.15mm layer height for surface finish', 'Post-processed and sanded'],
    outcome: '47 parts delivered in 5 days · Team qualified for dynamic events · Aero parts survived full season', accent: '#e74c3c',
  },
  {
    id: 'enclosure-iot', category: '3D Printing', tag: 'IoT / Product Dev', emoji: '📦',
    title: 'Industrial IoT Enclosure', client: 'StartupPune — sensor startup', duration: '48 hours',
    summary: 'Rapid prototyped IP54 enclosure for an industrial IoT sensor device. 3 design iterations in 2 days from sketch to injection-mould-ready CAD with wall thickness analysis.',
    tech: ['PETG (impact resistant)', 'IP54 gasket channel design', 'M3 brass heat-set inserts', 'DIN rail mount integrated', 'CAD: SolidWorks STEP delivered'],
    outcome: '3 iterations in 48hr · Client proceeded to injection mould with same CAD · 10,000 unit production order', accent: '#9b59b6',
  },
  {
    id: 'robotic-arm', category: 'Robotics', tag: 'Automation', emoji: '🦾',
    title: '4-DOF Conveyor Pick & Place', client: 'Electronics assembly MSME, Pune', duration: '6 weeks',
    summary: '4 degree-of-freedom robotic arm for PCB component sorting on a conveyor line. Computer vision (YOLOv8) detects component type and orientation; arm places at ±0.5mm.',
    tech: ['4-DOF custom arm (CF links)', 'Dynamixel XM430 servos', 'Jetson Nano + YOLOv8 vision', 'ROS2 control stack', 'Custom suction end-effector'],
    outcome: '720 components/hr throughput · Replaced 2 manual workers · ROI in 8 months', accent: '#f39c12',
  },
  {
    id: 'pcb-drone', category: 'Prototyping', tag: 'PCB Design', emoji: '🔌',
    title: 'Custom Drone Power Distribution Board', client: 'Internal / for sale', duration: '2 weeks',
    summary: 'Custom 4-in-1 power distribution board for FPV drones with integrated current sensor, voltage regulator, and capacitor bank. Designed for 4S–6S LiPo and 45A continuous.',
    tech: ['KiCad schematic + layout', '2oz copper, 4-layer PCB', 'Current sense (INA226)', '5V/9V BEC regulator', 'JLCPCB manufacturing + assembly'],
    outcome: 'Prototype to assembled PCB in 10 days · 50 units in first production run', accent: '#1abc9c',
  },
  {
    id: 'lab-automation', category: 'Automation', tag: 'Industrial', emoji: '⚙️',
    title: 'Liquid Dispensing Automation', client: 'R&D lab, Pune University', duration: '3 weeks',
    summary: 'Automated micro-volume liquid dispensing system for chemistry lab sample preparation. Replaces manual pipetting with 96-well plate accuracy and Arduino-controlled stepper motion.',
    tech: ['Arduino Mega + custom shield', 'NEMA 17 stepper + TMC2209', 'Peristaltic pump (0.1ml resolution)', 'Custom PCB control board', 'Python GUI for protocol input'],
    outcome: '96 samples in 8 min vs. 45 min manual · Error rate dropped from 12% → 0.3%', accent: '#e67e22',
  },
]

export default function PortfolioPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif", color: '#111', paddingTop: '90px' }}>

      {/* Hero */}
      <section style={{ padding: '48px 20px 40px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', letterSpacing: '0.15em', marginBottom: 16 }}>
          // PORTFOLIO — REAL BUILDS, REAL ENGINEERING
        </p>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 10vw, 88px)', color: '#111', margin: '0 0 16px', letterSpacing: '0.03em', lineHeight: 0.95 }}>
          WHAT WE&apos;VE <span style={{ color: '#FF8C35' }}>BUILT</span>
        </h1>
        <p style={{ fontSize: 16, color: '#888', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
          From FPV race drones to industrial automation — every project shipped from our Pune workshop.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[{ n: '50+', l: 'Projects' }, { n: '30+', l: 'Clients' }, { n: '8', l: 'Verticals' }, { n: '48hr', l: 'Fastest' }].map(s => (
            <div key={s.l} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '14px 20px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#FF8C35', letterSpacing: '0.04em' }}>{s.n}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects grid */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 20 }}>
          {PROJECTS.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              {/* Header band */}
              <div style={{ background: p.accent + '12', borderBottom: `1px solid ${p.accent}28`, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 36, width: 56, height: 56, background: p.accent + '18', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {p.emoji}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: p.accent, background: p.accent + '18', padding: '2px 8px', borderRadius: 4 }}>{p.category.toUpperCase()}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#999', background: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: 4 }}>{p.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#111', margin: 0, letterSpacing: '0.03em', lineHeight: 1.1 }}>{p.title}</h3>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#999', flexWrap: 'wrap' }}>
                  <span>👤 {p.client}</span>
                  <span>⏱ {p.duration}</span>
                </div>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65, margin: 0 }}>{p.summary}</p>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '0.08em', marginBottom: 8 }}>TECH STACK</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {p.tech.map(t => (
                      <span key={t} style={{ fontSize: 11, color: '#777', background: '#f4f4f2', border: '1px solid #e8e8e8', padding: '3px 8px', borderRadius: 4 }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ background: p.accent + '10', border: `1px solid ${p.accent}25`, borderRadius: 10, padding: '10px 14px', marginTop: 'auto' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: p.accent, letterSpacing: '0.08em', marginBottom: 4 }}>OUTCOME</div>
                  <div style={{ fontSize: 12, color: '#555', lineHeight: 1.5 }}>{p.outcome}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 60, padding: '48px 20px', background: '#FF8C35', borderRadius: 20 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)', color: '#000', margin: '0 0 12px', letterSpacing: '0.04em' }}>
            GOT A PROJECT IN MIND?
          </h2>
          <p style={{ fontSize: 15, color: '#5c3a00', margin: '0 auto 28px', maxWidth: 440 }}>
            Tell us what you&apos;re building. We&apos;ll get back with a detailed quote within 24 hours.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/get-a-quote" style={{ display: 'inline-block', padding: '13px 28px', background: '#000', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Get a Free Quote →
            </Link>
            <Link href="/consultation" style={{ display: 'inline-block', padding: '13px 28px', background: 'rgba(0,0,0,0.12)', color: '#000', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Talk to the team
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
