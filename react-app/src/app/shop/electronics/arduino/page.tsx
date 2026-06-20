'use client';
import Link from 'next/link';

const SUBCATS = [
  {
    key: 'arduino-boards',
    name: 'Arduino Boards',
    desc: 'Official Arduino boards, clones and compatible — Uno, Mega, Nano, LilyPad, Leonardo, Due and more.',
    img: 'https://images.unsplash.com/photo-1586920740099-f3ceb65bc51e?w=600&q=80&auto=format&fit=crop',
    emoji: '🔵',
    link: '/shop/electronics/products?cat=arduino&type=arduino-boards',
  },
  {
    key: 'arduino-shields',
    name: 'Arduino Shields',
    desc: 'Motor shields, relay shields, WiFi shields, sensor shields and expansion modules.',
    img: 'https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?w=600&q=80&auto=format&fit=crop',
    emoji: '🛡️',
    link: '/shop/electronics/products?cat=arduino&type=arduino-shields',
  },
  {
    key: 'arduino-displays',
    name: 'TFT / Screens / Displays',
    desc: 'TFT LCD displays, OLED modules, e-ink screens and character LCDs for Arduino projects.',
    img: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&q=80&auto=format&fit=crop',
    emoji: '🖥️',
    link: '/shop/electronics/products?cat=arduino&type=arduino-displays',
  },
  {
    key: 'arduino-accessories',
    name: 'Arduino Accessories',
    desc: 'Cases, cables, starter kits and everything else that goes with your Arduino.',
    img: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?w=600&q=80&auto=format&fit=crop',
    emoji: '🧩',
    link: '/shop/electronics/products?cat=arduino&type=arduino-accessories',
  },
];

export default function ArduinoPage() {
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
          padding:0 2rem; height:88px; z-index:100;
        }
        .sl-nav-logo { display:flex; align-items:center; gap:0; text-decoration:none; }
        .sl-nav-logo img { width:auto; height:88px; filter:brightness(0) saturate(100%) invert(56%) sepia(85%) saturate(800%) hue-rotate(345deg) brightness(103%); mix-blend-mode:multiply; margin-right:-4px; }
        .sl-nav-wordmark .top { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--orange); letter-spacing:0.03em; line-height:1; }
        .sl-nav-wordmark .sub { font-size:10px; font-weight:500; color:var(--orange); letter-spacing:0.2em; text-transform:uppercase; margin-top:3px; }
        .sl-back { font-size:14px; color:var(--muted); text-decoration:none; display:flex; align-items:center; gap:6px; transition:color 0.15s; }
        .sl-back:hover { color:var(--text); }

        .sl-wrap { max-width:1100px; margin:0 auto; padding:96px 24px 80px; }
        .sl-crumb { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--orange); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:16px; }
        .sl-heading { font-family:'Bebas Neue',sans-serif; font-size:clamp(40px,7vw,72px); color:#111; line-height:0.95; margin-bottom:10px; }
        .sl-sub { font-size:16px; color:var(--muted); margin-bottom:40px; }

        .sec-label { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--orange); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:8px; }
        .sec-title { font-family:'Bebas Neue',sans-serif; font-size:32px; letter-spacing:1px; margin-bottom:24px; }

        .subcat-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
          gap:16px;
          margin-bottom:48px;
        }
        .subcat-card {
          display:block; text-decoration:none; color:inherit;
          background:#fff; border:1.5px solid var(--border);
          border-radius:16px; overflow:hidden;
          transition:all 0.22s;
        }
        .subcat-card:hover { border-color:var(--orange); transform:translateY(-3px); box-shadow:0 12px 32px rgba(255,140,53,0.13); }
        .subcat-img {
          height:140px; background:var(--bg2);
          display:flex; align-items:center; justify-content:center;
          border-bottom:1px solid var(--border);
          overflow:hidden;
        }
        .subcat-img img { width:100%; height:100%; object-fit:cover; }
        .subcat-img .emoji { font-size:56px; }
        .subcat-body { padding:14px 16px 16px; }
        .subcat-name { font-weight:700; font-size:14px; margin-bottom:5px; color:var(--text); line-height:1.4; }
        .subcat-desc { font-size:12px; color:var(--muted); line-height:1.55; margin-bottom:12px; }
        .subcat-arrow { font-size:12px; font-weight:600; color:var(--orange); }
        .subcat-card:hover .subcat-arrow { text-decoration:underline; }

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
          .subcat-grid { grid-template-columns:1fr 1fr; gap:12px; }
          .subcat-img { height:110px; }
          .sl-wrap { padding:80px 16px 60px; }
        }
        @media(max-width:360px) { .subcat-grid { grid-template-columns:1fr; } }
      `}</style>

      <nav className="sl-nav">
        <a href="/" className="sl-nav-logo">
          <img src="/logo.png" alt="Kyzer Robotics" />
          <div className="sl-nav-wordmark">
            <div className="top">Kyzer</div>
            <div className="sub">Robotics</div>
          </div>
        </a>
        <Link href="/shop/electronics" className="sl-back">← Electronics</Link>
      </nav>

      <div className="sl-wrap">
        <div className="sl-crumb">// Shop / Electronics / Arduino</div>
        <h1 className="sl-heading">Arduino &amp; Microcontrollers</h1>
        <p className="sl-sub">Official boards, clones, shields, displays and accessories for every Arduino project.</p>

        <div className="sec-label">// Browse by type</div>
        <div className="sec-title">Arduino Categories</div>

        <div className="subcat-grid">
          {SUBCATS.map(s => (
            <Link key={s.key} href={s.link} className="subcat-card">
              <div className="subcat-img">
                {s.img
                  ? <img src={s.img} alt={s.name} />
                  : <span className="emoji">{s.emoji}</span>
                }
              </div>
              <div className="subcat-body">
                <div className="subcat-name">{s.name}</div>
                <div className="subcat-desc">{s.desc}</div>
                <div className="subcat-arrow">Shop now →</div>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/shop/electronics/products?cat=arduino" className="all-card">
          <div className="all-card-text">
            <div className="title">Browse All Arduino Products</div>
            <div className="sub">View every Arduino item in one place — filter, sort and compare.</div>
          </div>
          <div className="all-card-btn">View All →</div>
        </Link>
      </div>
    </>
  );
}
