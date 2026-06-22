import Link from 'next/link'
import { Check } from 'lucide-react'

export interface ServiceFAQ { q: string; a: string }
export interface ServiceFeature { icon: string; title: string; desc: string }
export interface ServiceProcess { step: string; title: string; desc: string }

export interface ServicePageProps {
  badge: string
  headline: string
  accentWord: string
  subheadline: string
  tagline: string
  heroEmoji: string
  accent: string
  features: ServiceFeature[]
  process: ServiceProcess[]
  faqs: ServiceFAQ[]
  stats: { value: string; label: string }[]
  cta: { primary: string; primaryHref: string; secondary: string; secondaryHref: string }
  relatedLinks: { label: string; href: string }[]
}

export function ServicePageLayout({
  badge, headline, accentWord, subheadline, tagline,
  heroEmoji, accent, features, process, faqs, stats, cta, relatedLinks,
}: ServicePageProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{ background: '#f8f8f6', borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.05em' }}>
          KYZER <span style={{ fontSize: 10, color: '#111', letterSpacing: '0.2em' }}>ROBOTICS</span>
        </Link>
        <div style={{ display: 'flex', gap: 20, fontSize: 13, alignItems: 'center' }}>
          <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link>
          <Link href="/portfolio" style={{ color: '#666', textDecoration: 'none' }}>Portfolio</Link>
          <Link href={cta.primaryHref} style={{ background: accent, color: '#fff', padding: '8px 18px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 13 }}>
            {cta.primary}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: '#111', color: '#fff', padding: '80px 24px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 70% 50%, ${accent}18 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', background: accent + '20', border: `1px solid ${accent}40`, borderRadius: 20, padding: '5px 14px', fontSize: 11, color: accent, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 20 }}>
              {badge}
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 7vw, 80px)', margin: '0 0 20px', letterSpacing: '0.03em', lineHeight: 0.95 }}>
              {headline}<br /><span style={{ color: accent }}>{accentWord}</span>
            </h1>
            <p style={{ fontSize: 18, color: '#bbb', maxWidth: 520, lineHeight: 1.65, marginBottom: 32 }}>{subheadline}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={cta.primaryHref} style={{ display: 'inline-block', padding: '14px 28px', background: accent, color: '#fff', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                {cta.primary}
              </Link>
              <Link href={cta.secondaryHref} style={{ display: 'inline-block', padding: '14px 28px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
                {cta.secondary}
              </Link>
            </div>
            <p style={{ fontSize: 13, color: '#555', marginTop: 16 }}>{tagline}</p>
          </div>
          <div style={{ fontSize: 120, opacity: 0.3, display: 'none' }}>{heroEmoji}</div>
        </div>

        {/* Stats */}
        <div style={{ maxWidth: 1100, margin: '48px auto 0', display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 16 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: accent, letterSpacing: '0.04em' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.12em', marginBottom: 12 }}>// CAPABILITIES</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)', color: '#111', margin: 0, letterSpacing: '0.04em' }}>WHAT WE OFFER</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {features.map(f => (
            <div key={f.title} style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', padding: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#111', margin: '0 0 10px', letterSpacing: '0.03em' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#666', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section style={{ background: '#111', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.12em', marginBottom: 12 }}>// HOW IT WORKS</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)', color: '#fff', margin: 0, letterSpacing: '0.04em' }}>THE PROCESS</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {process.map((p, i) => (
              <div key={p.step} style={{ background: '#1a1a1a', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', padding: 24, position: 'relative' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: accent, opacity: 0.25, position: 'absolute', top: 12, right: 16, lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.1em', marginBottom: 10 }}>{p.step}</div>
                <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#fff', margin: '0 0 10px', letterSpacing: '0.03em' }}>{p.title}</h4>
                <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.12em', marginBottom: 12 }}>// FAQ</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)', color: '#111', margin: 0, letterSpacing: '0.04em' }}>COMMON QUESTIONS</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)', padding: '20px 24px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Check size={16} color={accent} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 6 }}>{f.q}</div>
                  <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{f.a}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related services */}
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '32px 24px', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', fontSize: 13 }}>
        <span style={{ color: '#aaa' }}>Related services:</span>
        {relatedLinks.map(l => (
          <Link key={l.href} href={l.href} style={{ color: '#FF8C35', textDecoration: 'none', fontWeight: 500 }}>{l.label}</Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <section style={{ background: accent, padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 56px)', color: '#fff', margin: '0 0 16px', letterSpacing: '0.04em' }}>
          START YOUR PROJECT TODAY
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 28 }}>
          Get a free quote within 24 hours. No commitment required.
        </p>
        <Link href={cta.primaryHref} style={{ display: 'inline-block', padding: '16px 40px', background: '#fff', color: accent, borderRadius: 12, fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
          {cta.primary}
        </Link>
      </section>
    </div>
  )
}
