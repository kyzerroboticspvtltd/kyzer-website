'use client';
import Link from 'next/link';

export default function DronesPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
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

        .sl-wrap { max-width:900px; margin:0 auto; padding:96px 24px 80px; }
        .sl-crumb { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--orange); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:16px; }
        .sl-heading { font-family:'Bebas Neue',sans-serif; font-size:clamp(48px,8vw,80px); color:#111; line-height:0.95; margin-bottom:10px; }
        .sl-sub { font-size:16px; color:var(--muted); margin-bottom:52px; }

        .sl-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        @media(max-width:600px) { .sl-grid { grid-template-columns:1fr; } }

        .sl-card {
          display:block; text-decoration:none; color:inherit;
          background:var(--bg2); border:1.5px solid var(--border);
          border-radius:20px; padding:2.5rem 2rem;
          transition:all 0.22s; position:relative; overflow:hidden;
        }
        .sl-card:hover { border-color:var(--orange); transform:translateY(-5px); box-shadow:0 16px 40px rgba(255,140,53,0.13); }
        .sl-card::before { content:''; position:absolute; inset:0; background:radial-gradient(circle at 50% 0%,rgba(255,140,53,0.07) 0%,transparent 70%); opacity:0; transition:opacity 0.3s; }
        .sl-card:hover::before { opacity:1; }

        .sl-card-icon { font-size:48px; margin-bottom:1.25rem; }
        .sl-card-name { font-family:'Bebas Neue',sans-serif; font-size:32px; color:#111; letter-spacing:0.02em; margin-bottom:10px; }
        .sl-card-desc { font-size:14px; color:var(--muted); line-height:1.6; margin-bottom:1.5rem; }
        .sl-card-arrow { font-size:14px; font-weight:600; color:var(--orange); }
        .sl-card:hover .sl-card-arrow { text-decoration:underline; }
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
        <div className="sl-crumb">// Shop / Drones</div>
        <h1 className="sl-heading">Drones</h1>
        <p className="sl-sub">Choose a category to browse products.</p>

        <div className="sl-grid">
          <Link href="/shop/drone-frames" className="sl-card">
            <div className="sl-card-icon">🏗️</div>
            <div className="sl-card-name">Drone Frames</div>
            <div className="sl-card-desc">Racing, quadcopter & hexacopter frames — carbon fiber & glass fiber. Pick your geometry and build weight.</div>
            <div className="sl-card-arrow">Browse Frames →</div>
          </Link>
          <Link href="/shop/complete-drones" className="sl-card">
            <div className="sl-card-icon">🛸</div>
            <div className="sl-card-name">Complete Drones</div>
            <div className="sl-card-desc">Ready-to-fly survey, FPV & agricultural drones — fully assembled and tested before shipping.</div>
            <div className="sl-card-arrow">Browse Drones →</div>
          </Link>
        </div>
      </div>
    </>
  );
}
