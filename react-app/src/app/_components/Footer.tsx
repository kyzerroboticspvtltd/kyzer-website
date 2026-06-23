export default function Footer() {
  return (
    <footer style={{ fontFamily: "'DM Sans', sans-serif", background: '#f0f0ee', color: '#666' }}>

      {/* Trust badges */}
      <div style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '12px 32px', alignItems: 'center', justifyContent: 'center' }}>
          {[
            { icon: '🔒', label: 'Secure Payments', sub: 'Razorpay' },
            { icon: '🚚', label: 'Pan-India Shipping', sub: 'Blue Dart · Delhivery' },
            { icon: '⚡', label: '48hr Turnaround', sub: 'Pune workshop' },
            { icon: '✅', label: 'Genuine Parts', sub: '100% authentic' },
            { icon: '🤝', label: 'After-Sales Support', sub: 'WhatsApp · Email' },
            { icon: '🏭', label: 'Made in India', sub: 'Designed in Pune' },
          ].map(b => (
            <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{b.icon}</span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#111', margin: 0, lineHeight: 1.2 }}>{b.label}</p>
                <p style={{ fontSize: 10, color: '#888', margin: 0 }}>{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(2.5rem,5vw,3.5rem) clamp(1.25rem,4vw,2.5rem)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '2.5rem 2rem' }}>

        {/* Brand col */}
        <div style={{ gridColumn: 'span 2' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 14 }}>
            <img src="/logo.png" alt="Kyzer Robotics" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#FF8C35', lineHeight: 0.9, letterSpacing: '0.03em' }}>
              Kyzer<span style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', color: '#aaa', marginTop: 3 }}>ROBOTICS</span>
            </span>
          </a>
          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7, maxWidth: 280, marginBottom: 20 }}>
            Custom drones, electronics &amp; precision 3D printing — designed and built in Pune, India.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: '📍', text: 'Ambegaon Pathar, Pune, Maharashtra', href: 'https://maps.google.com/?q=Kyzer+Robotics+Ambegaon+Pathar+Pune' },
              { icon: '✉️', text: 'info@kyzerrobotics.com', href: 'mailto:info@kyzerrobotics.com' },
              { icon: '📞', text: '+91 90496 95264', href: 'tel:+919049695264' },
              { icon: '🕑', text: 'Mon–Sat · 10 AM – 7 PM IST', href: null },
            ].map(r => (
              <div key={r.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#888', lineHeight: 1.5 }}>
                <span style={{ flexShrink: 0, lineHeight: 1.5 }}>{r.icon}</span>
                {r.href
                  ? <a href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel="noopener" style={{ color: '#888', textDecoration: 'none' }}>{r.text}</a>
                  : <span>{r.text}</span>
                }
              </div>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: '0.06em', color: '#111', marginBottom: 14 }}>Shop</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              ['Drones', '/shop/drones'],
              ['Complete Drones', '/shop/complete-drones'],
              ['Drone Frames', '/shop/drone-frames'],
              ['Electronics', '/shop/electronics'],
              ['3D Printing', '/shop/3d-printing'],
              ['Printers & Supplies', '/shop/printers-supplies'],
              ['Search Products', '/search'],
            ].map(([label, href]) => (
              <a key={href} href={href} style={{ fontSize: 13, color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FF8C35')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}>{label}</a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: '0.06em', color: '#111', marginBottom: 14 }}>Services</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              ['3D Printing', '/services/3d-printing'],
              ['Drone Development', '/services/drone-development'],
              ['PCB Design', '/services/pcb-design'],
              ['Robotics Solutions', '/services/robotics-solutions'],
              ['Industrial Automation', '/services/industrial-automation'],
              ['Rapid Prototyping', '/services/prototyping'],
              ['Free Consultation', '/consultation'],
            ].map(([label, href]) => (
              <a key={href} href={href} style={{ fontSize: 13, color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FF8C35')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}>{label}</a>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: '0.06em', color: '#111', marginBottom: 14 }}>Company</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              ['About Us', '/about'],
              ['Portfolio', '/portfolio'],
              ['Blog', '/blog'],
              ['Contact', '/contact'],
              ['Pricing', '/pricing'],
              ['Get a 3D Quote', '/get-a-quote'],
              ['Kyzer Studio', '/studio'],
            ].map(([label, href]) => (
              <a key={href} href={href} style={{ fontSize: 13, color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FF8C35')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}>{label}</a>
            ))}
          </div>
        </div>

        {/* Policies */}
        <div>
          <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: '0.06em', color: '#111', marginBottom: 14 }}>Legal</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              ['Privacy Policy', '/privacy'],
              ['Terms & Conditions', '/terms'],
              ['Refund Policy', '/refund-policy'],
              ['Cancellation Policy', '/cancellation'],
              ['Shipping & Delivery', '/shipping-policy'],
            ].map(([label, href]) => (
              <a key={href} href={href} style={{ fontSize: 13, color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FF8C35')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}>{label}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '1.2rem clamp(1.25rem,4vw,2.5rem)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>
            © 2026 Kyzer Robotics Pvt. Ltd. — All Rights Reserved · Made with ❤️ in Pune, India
          </p>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              {
                href: 'https://www.instagram.com/kyzer.robotics', label: 'Instagram',
                svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 15, height: 15 }}><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/></svg>,
              },
              {
                href: 'https://wa.me/919049695264', label: 'WhatsApp',
                svg: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 15, height: 15 }}><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>,
              },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener" aria-label={s.label}
                style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FF8C35'; e.currentTarget.style.borderColor = '#FF8C35'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = '#aaa'; }}>
                {s.svg}
              </a>
            ))}
          </div>

          {/* Payment chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {['UPI', 'VISA', 'Mastercard', 'RuPay'].map(m => (
              <span key={m} style={{ fontSize: 10, fontWeight: 700, color: '#888', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, padding: '3px 7px' }}>{m}</span>
            ))}
            <span style={{ fontSize: 10, fontWeight: 700, color: '#FF8C35', background: '#fff', border: '1px solid rgba(255,140,53,0.3)', borderRadius: 4, padding: '3px 7px' }}>🔒 Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
