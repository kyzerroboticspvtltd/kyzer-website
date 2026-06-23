import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — Kyzer Robotics Pvt. Ltd.',
  description: 'Kyzer Robotics Pvt. Ltd. is a Pune-based technology company building custom drones, electronics, AI-integrated robotics, and precision 3D-printed parts for makers, startups, and industry.',
  alternates: { canonical: 'https://kyzerrobotics.com/about' },
  robots: 'index, follow',
}

const TEAM = [
  {
    name: 'Ayaan Shaikh',
    role: 'Founder & CEO',
    emoji: '👨‍💻',
    bio: 'Robotics engineer and entrepreneur. Leads product development, drone engineering, and business strategy at Kyzer Robotics. Passionate about making advanced robotics accessible to students and startups.',
    skills: ['Robotics', 'Drones', 'Embedded Systems', 'Business'],
  },
]

const VALUES = [
  { icon: '⚡', title: 'Speed', desc: '48-hour turnaround on standard 3D print orders. We move fast so you can too.' },
  { icon: '🛠️', title: 'Craft', desc: 'Every part we print, every robot we build, every PCB we design is done with engineering precision.' },
  { icon: '🤝', title: 'Honesty', desc: 'We tell you what your project actually needs, not what costs the most.' },
  { icon: '🎓', title: 'Education', desc: 'We support students and college teams. Discounted rates, mentorship, and real-world builds.' },
]

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', color: '#111', paddingTop: '80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 20px 120px' }}>

        {/* Header */}
        <p style={{ color: '#FF8C35', fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.15em', marginBottom: 20 }}>
          // ABOUT KYZER ROBOTICS
        </p>
        <h1 style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: 30, letterSpacing: '-0.03em' }}>
          WE BUILD THE<br /><span style={{ color: '#FF8C35' }}>FUTURE OF</span><br />ENGINEERING
        </h1>
        <p style={{ color: '#888', fontSize: 20, maxWidth: 620, lineHeight: 1.8, marginBottom: 80 }}>
          Kyzer Robotics Pvt. Ltd. is a Pune-based engineering company founded by engineers passionate about drones, robotics, and advanced manufacturing. We build custom solutions: fast, honestly priced, and made in India.
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 100 }}>
          {[
            { v: '50+', l: 'Projects Delivered' },
            { v: '30+', l: 'Happy Clients' },
            { v: '2023', l: 'Founded' },
            { v: 'Pune', l: 'India' },
          ].map(s => (
            <div key={s.l} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 800, color: '#FF8C35', marginBottom: 8 }}>{s.v}</p>
              <p style={{ color: '#666', fontSize: 13 }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, marginBottom: 100, alignItems: 'center' }}>
          <div>
            <p style={{ color: '#FF8C35', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.15em', marginBottom: 16 }}>OUR MISSION</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
              Making advanced engineering accessible to every student, startup, and maker in India
            </h2>
            <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 20 }}>
              We started Kyzer Robotics because we noticed a gap: students and small teams in India had great ideas but no accessible, quality engineering partner to build with. Expensive quotes, slow turnaround, no communication.
            </p>
            <p style={{ color: '#888', lineHeight: 1.8 }}>
              We are the opposite: fast, transparent, and genuinely invested in your project&apos;s success.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {VALUES.map(v => (
              <div key={v.title} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '24px 20px' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{v.icon}</div>
                <p style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>{v.title}</p>
                <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: 100 }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, marginBottom: 48 }}>Built by engineers,<br />for engineers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {TEAM.map(member => (
              <div key={member.name} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '36px 28px' }}>
                <div style={{ width: 72, height: 72, background: '#fff3e8', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 20 }}>
                  {member.emoji}
                </div>
                <p style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{member.name}</p>
                <p style={{ color: '#FF8C35', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{member.role}</p>
                <p style={{ color: '#888', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{member.bio}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {member.skills.map(s => (
                    <span key={s} style={{ padding: '4px 12px', background: '#f4f4f2', border: '1px solid #e8e8e8', borderRadius: 20, fontSize: 11, color: '#666' }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
            {/* Join the team card */}
            <div style={{ background: 'transparent', border: '1px dashed #ccc', borderRadius: 20, padding: '36px 28px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 20 }}>✨</div>
              <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Join the team</p>
              <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>We are always looking for passionate engineers, makers, and designers to work on real robotics projects.</p>
              <a href="mailto:info@kyzerrobotics.com?subject=I'd%20like%20to%20join%20Kyzer%20Robotics" style={{ color: '#FF8C35', fontSize: 14, fontWeight: 600 }}>
                Get in touch →
              </a>
            </div>
          </div>
        </div>

        {/* Location */}
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '48px 40px', marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Pune, Maharashtra, India</h2>
          <p style={{ color: '#888', lineHeight: 1.8, maxWidth: 560, marginBottom: 32 }}>
            Our workshop, 3D printers, and engineering team are all based in Ambegaon Pathar, Pune. Pune customers can visit in person with no appointment needed. We ship pan-India via courier with full tracking.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/contact" style={{ padding: '12px 24px', background: '#FF8C35', color: '#000', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Contact Us</a>
            <a href="https://maps.google.com/?q=Kyzer+Robotics+Ambegaon+Pathar+Pune" target="_blank" rel="noopener" style={{ padding: '12px 24px', background: 'transparent', color: '#555', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: 14, border: '1px solid #ccc' }}>
              View on Maps →
            </a>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, marginBottom: 16 }}>Ready to build something?</h2>
          <p style={{ color: '#888', marginBottom: 28 }}>Prototype to production. We&apos;ll build it with you.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/get-a-quote" style={{ padding: '14px 32px', background: '#FF8C35', color: '#000', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Get a Quote →</a>
            <a href="/portfolio" style={{ padding: '14px 32px', background: '#f0f0ee', color: '#111', borderRadius: 8, fontWeight: 600, textDecoration: 'none', border: '1px solid #ddd' }}>See Our Work</a>
          </div>
        </div>
      </div>
    </main>
  )
}
