'use client';
import Link from 'next/link';

const CATEGORIES = [
  {
    key: 'arduino',
    name: 'Arduino & Microcontrollers',
    icon: '🔵',
    desc: 'Arduino boards, clones, shields and accessories for prototyping and embedded projects.',
    link: '/shop/electronics/arduino',
    browse: 'Browse Arduino →',
  },
  {
    key: 'raspberry-pi',
    name: 'Raspberry Pi & SBCs',
    icon: '🍓',
    desc: 'Raspberry Pi boards, accessories, and other single-board computers for your projects.',
    link: '/shop/electronics/products?cat=raspberry-pi',
    browse: 'Browse SBCs →',
  },
  {
    key: 'sensors',
    name: 'Sensors & Modules',
    icon: '📡',
    desc: 'Temperature, humidity, distance, IMU, GPS, cameras and more — ready to plug in.',
    link: '/shop/electronics/products?cat=sensors',
    browse: 'Browse Sensors →',
  },
  {
    key: 'motors',
    name: 'Motors & Actuators',
    icon: '⚙️',
    desc: 'DC motors, servo motors, stepper motors, ESCs and motor drivers for robotics builds.',
    link: '/shop/electronics/products?cat=motors',
    browse: 'Browse Motors →',
  },
  {
    key: 'components',
    name: 'Electronic Components',
    icon: '🔌',
    desc: 'Resistors, capacitors, transistors, ICs, LEDs, breadboards and passive components.',
    link: '/shop/electronics/products?cat=components',
    browse: 'Browse Components →',
  },
  {
    key: 'tools',
    name: 'Tools & Equipment',
    icon: '🔧',
    desc: 'Soldering irons, multimeters, oscilloscopes, helping hands and workshop essentials.',
    link: '/shop/electronics/products?cat=tools',
    browse: 'Browse Tools →',
  },
];

export default function ElectronicsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        :root { --orange:#FF8C35; --bg:#faf9f6; --bg2:#f2f0eb; --border:rgba(0,0,0,0.09); --text:#111; --muted:#666; }
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--text); }

        .sl-nav {
          position:fixed; top:0; left:0; right:0;
          background:rgba(250,249,246,0.92); backdrop-filter:blur(12px);
          border-bottom:0.5px solid var(--border);
          display:flex; align-items:center; justify-content:space-between;
          padding:0 2rem; height:64px; z-index:100;
        }
        .sl-nav-logo { display:flex; align-items:center; gap:0; text-decoration:none; }
        .sl-nav-logo img { width:auto; height:46px; filter:brightness(0) saturate(100%) invert(56%) sepia(85%) saturate(800%) hue-rotate(345deg) brightness(103%); mix-blend-mode:multiply; margin-right:-4px; }
        .sl-nav-wordmark .top { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--orange); letter-spacing:0.03em; line-height:1; }
        .sl-nav-wordmark .sub { font-size:10px; font-weight:500; color:var(--orange); letter-spacing:0.2em; text-transform:uppercase; margin-top:3px; }
        .sl-back { font-size:14px; color:var(--muted); text-decoration:none; display:flex; align-items:center; gap:6px; transition:color 0.15s; }
        .sl-back:hover { color:var(--text); }

        .sl-wrap { max-width:1100px; margin:0 auto; padding:96px 24px 80px; }
        .sl-crumb { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--orange); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:16px; }
        .sl-heading { font-family:'Bebas Neue',sans-serif; font-size:clamp(48px,8vw,80px); color:#111; line-height:0.95; margin-bottom:10px; }
        .sl-sub { font-size:16px; color:var(--muted); margin-bottom:40px; }

        .sec-label { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--orange); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:8px; }
        .sec-title { font-family:'Bebas Neue',sans-serif; font-size:32px; letter-spacing:1px; margin-bottom:24px; }

        .cat-grid {
          display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:18px;
          margin-bottom:52px;
        }
        .cat-card {
          display:block; text-decoration:none; color:inherit;
          background:#fff; border:1.5px solid var(--border);
          border-radius:18px; overflow:hidden;
          transition:all 0.22s; position:relative;
        }
        .cat-card:hover { border-color:var(--orange); transform:translateY(-4px); box-shadow:0 14px 36px rgba(255,140,53,0.12); }
        .cat-card-img {
          height:160px; background:var(--bg2);
          display:flex; align-items:center; justify-content:center;
          font-size:64px; border-bottom:1px solid var(--border);
        }
        .cat-card-body { padding:18px 20px 20px; }
        .cat-card-name { font-weight:700; font-size:16px; margin-bottom:6px; color:var(--text); }
        .cat-card-desc { font-size:13px; color:var(--muted); line-height:1.6; margin-bottom:14px; }
        .cat-card-arrow { font-size:13px; font-weight:600; color:var(--orange); }
        .cat-card:hover .cat-card-arrow { text-decoration:underline; }

        .all-card {
          display:flex; align-items:center; justify-content:space-between;
          gap:16px; flex-wrap:wrap;
          background:#fff3e8; border:1.5px solid rgba(255,140,53,0.3);
          border-radius:16px; padding:1.5rem 2rem;
          text-decoration:none; color:inherit;
          transition:all 0.2s;
        }
        .all-card:hover { background:#ffe8d0; border-color:var(--orange); }
        .all-card-text .title { font-weight:700; font-size:16px; margin-bottom:4px; }
        .all-card-text .sub { font-size:13px; color:var(--muted); }
        .all-card-btn { background:var(--orange); color:#111; padding:10px 22px; border-radius:10px; font-size:13px; font-weight:700; white-space:nowrap; }

        @media(max-width:600px) {
          .cat-grid { grid-template-columns:1fr 1fr; gap:12px; }
          .cat-card-img { height:120px; font-size:48px; }
          .sl-wrap { padding:80px 16px 60px; }
        }
        @media(max-width:400px) { .cat-grid { grid-template-columns:1fr; } }
      `}</style>

      <nav className="sl-nav">
        <a href="/" className="sl-nav-logo">
          <img src="/logo.png" alt="Kyzer Robotics" />
          <div className="sl-nav-wordmark">
            <div className="top">Kyzer</div>
            <div className="sub">Robotics</div>
          </div>
        </a>
        <Link href="/#products" className="sl-back">← Shop</Link>
      </nav>

      <div className="sl-wrap">
        <div className="sl-crumb">// Shop / Electronics</div>
        <h1 className="sl-heading">Electronics</h1>
        <p className="sl-sub">Components, boards, sensors, tools and more for makers, students and engineers.</p>

        <div className="sec-label">// Popular Categories</div>
        <div className="sec-title">Shop by Category</div>

        <div className="cat-grid">
          {CATEGORIES.map(c => (
            <Link key={c.key} href={c.link} className="cat-card">
              <div className="cat-card-img">{c.icon}</div>
              <div className="cat-card-body">
                <div className="cat-card-name">{c.name}</div>
                <div className="cat-card-desc">{c.desc}</div>
                <div className="cat-card-arrow">{c.browse}</div>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/shop/electronics/products" className="all-card">
          <div className="all-card-text">
            <div className="title">Browse All Electronics</div>
            <div className="sub">View everything in one place — filter by category, sort by price.</div>
          </div>
          <div className="all-card-btn">View All →</div>
        </Link>
      </div>
    </>
  );
}
