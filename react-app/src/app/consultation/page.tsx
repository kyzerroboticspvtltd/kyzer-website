import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Free Consultation | Kyzer Robotics Pune',
  description: 'Book a free 30-minute consultation with the Kyzer Robotics team in Pune. Discuss your drone, 3D printing, robotics, or automation project.',
}

const OPTIONS = [
  {
    icon: '📞', title: 'Phone / WhatsApp call',
    desc: 'Call or WhatsApp us directly. We pick up Mon–Sat, 10 AM–7 PM IST.',
    cta: 'Call +91 90496 95264', href: 'tel:+919049695264',
  },
  {
    icon: '💬', title: 'WhatsApp message',
    desc: 'Send us a WhatsApp message describing your project. We reply within 2 hours.',
    cta: 'WhatsApp us', href: 'https://wa.me/919049695264?text=Hi%20Kyzer%20Robotics%2C%20I%20would%20like%20a%20free%20consultation%20about%20my%20project.',
  },
  {
    icon: '✉️', title: 'Email consultation',
    desc: 'Prefer email? Drop us a note at info@kyzerrobotics.com with your brief.',
    cta: 'Email us', href: 'mailto:info@kyzerrobotics.com?subject=Free%20Consultation%20Request',
  },
  {
    icon: '📋', title: 'Detailed project quote',
    desc: 'If you already have requirements, fill our structured quote form for a faster response.',
    cta: 'Get a quote →', href: '/get-a-quote',
  },
]

const STEPS = [
  { step: '01', title: 'Tell us your project', desc: "Describe what you want to build — drone, robot, 3D print, automation. The more detail the better, but sketches and rough ideas work too." },
  { step: '02', title: 'We assess feasibility', desc: "Our engineering team reviews your requirements and tells you what's technically possible, what it would cost, and how long it would take." },
  { step: '03', title: 'You get a clear plan', desc: 'A specific recommendation — build approach, technology stack, timeline, and a rough budget range. No vague "it depends" answers.' },
  { step: '04', title: 'Proceed or walk away', desc: "No obligation. If we're a fit, great. If not, we'll point you in the right direction. We'd rather turn down a bad fit than take on a project we can't do well." },
]

export default function ConsultationPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', color: '#111', paddingTop: '80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px 100px' }}>

        <p style={{ color: '#FF8C35', fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.15em', marginBottom: 20 }}>
          // FREE CONSULTATION — KYZER ROBOTICS
        </p>
        <h1 style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
          LET&apos;S TALK ABOUT<br /><span style={{ color: '#FF8C35' }}>YOUR PROJECT</span>
        </h1>
        <p style={{ color: '#888', fontSize: 18, maxWidth: 600, lineHeight: 1.7, marginBottom: 60 }}>
          Book a free 30-minute call with our engineering team. We&apos;ll understand your requirements, suggest the right approach, and give you an honest assessment — no pressure, no sales pitch.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>

          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: '#111' }}>Choose how to connect</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {OPTIONS.map(opt => (
                <a key={opt.title} href={opt.href} target={opt.href.startsWith('http') ? '_blank' : undefined} rel="noopener"
                   style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 28 }}>{opt.icon}</span>
                    <div>
                      <p style={{ fontWeight: 700, color: '#111', marginBottom: 4 }}>{opt.title}</p>
                      <p style={{ fontSize: 13, color: '#666', marginBottom: 10, lineHeight: 1.5 }}>{opt.desc}</p>
                      <span style={{ fontSize: 13, color: '#FF8C35', fontWeight: 600 }}>{opt.cta}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: '#111' }}>What to expect</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
              {STEPS.map(s => (
                <div key={s.step} style={{ display: 'flex', gap: 20 }}>
                  <div style={{
                    width: 40, height: 40, background: '#FF8C35', borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: '#000', flexShrink: 0, fontFamily: 'monospace',
                  }}>{s.step}</div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#111', marginBottom: 4 }}>{s.title}</p>
                    <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#FF8C35', letterSpacing: '0.1em', marginBottom: 16 }}>WHY KYZER ROBOTICS?</p>
              {[
                '✓ 50+ projects delivered across drones, robotics, and electronics',
                '✓ In-house 3D printing, PCB design, and firmware development',
                '✓ Based in Pune — fast turnaround, India-wide shipping',
                '✓ Student and startup friendly pricing',
                '✓ No ghost work — you own all source files and CAD',
              ].map(item => (
                <p key={item} style={{ fontSize: 13, color: '#888', marginBottom: 10, lineHeight: 1.5 }}>{item}</p>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 80, textAlign: 'center', padding: '60px 40px', background: '#FF8C35', borderRadius: 20 }}>
          <h2 style={{ fontFamily: 'monospace', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: '#000', marginBottom: 12 }}>
            READY TO BUILD SOMETHING?
          </h2>
          <p style={{ color: '#5c3a00', marginBottom: 28 }}>Our team is available Mon–Sat, 10 AM–7 PM IST. We usually respond to WhatsApp messages within 30 minutes.</p>
          <a href="https://wa.me/919049695264?text=Hi%20Kyzer%20Robotics%2C%20I%20need%20help%20with%20a%20project." target="_blank" rel="noopener"
             style={{ display: 'inline-block', padding: '16px 40px', background: '#000', color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 16 }}>
            Start on WhatsApp →
          </a>
        </div>
      </div>
    </main>
  )
}
