import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Shared chrome for the legal/policy pages (privacy, terms, refund, shipping).
 * Server component — no client JS needed, so these pages are fully crawlable.
 */
export default function LegalLayout({
  title,
  updated,
  crumb = 'Legal',
  children,
}: {
  title: string;
  updated?: string;
  crumb?: string;
  children: ReactNode;
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        :root { --orange:#FF8C35; --bg:#faf9f6; --bg2:#f2f0eb; --border:rgba(0,0,0,0.09); --text:#111; --muted:#666; }
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--text); }

        .lg-nav {
          position:fixed; top:0; left:0; right:0;
          background:rgba(250,249,246,0.92); backdrop-filter:blur(12px);
          border-bottom:0.5px solid var(--border);
          display:flex; align-items:center; justify-content:space-between;
          padding:0 2rem; height:64px; z-index:100;
        }
        .lg-nav-logo { display:flex; align-items:center; gap:0; text-decoration:none; }
        .lg-nav-logo img { width:auto; height:46px; margin-right:-4px; filter:brightness(0) saturate(100%) invert(56%) sepia(85%) saturate(800%) hue-rotate(345deg) brightness(103%); mix-blend-mode:multiply; }
        .lg-nav-wordmark .top { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--orange); letter-spacing:0.03em; line-height:1; }
        .lg-nav-wordmark .sub { font-size:10px; font-weight:500; color:var(--orange); letter-spacing:0.2em; text-transform:uppercase; margin-top:3px; }
        .lg-back { font-size:14px; color:var(--muted); text-decoration:none; transition:color 0.15s; }
        .lg-back:hover { color:var(--text); }

        .lg-wrap { max-width:780px; margin:0 auto; padding:104px 24px 100px; }
        .lg-crumb { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--orange); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:14px; }
        .lg-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(40px,7vw,68px); line-height:0.95; margin-bottom:10px; }
        .lg-updated { font-size:13px; color:var(--muted); margin-bottom:44px; }

        .lg-body { font-size:15px; line-height:1.75; color:#222; }
        .lg-body h2 { font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:0.02em; margin:38px 0 12px; color:#111; }
        .lg-body h3 { font-size:16px; font-weight:600; margin:24px 0 6px; }
        .lg-body p { margin-bottom:14px; color:#333; }
        .lg-body ul { margin:0 0 16px 1.2rem; }
        .lg-body li { margin-bottom:8px; color:#333; }
        .lg-body a { color:var(--orange); text-decoration:none; border-bottom:1px solid rgba(255,140,53,0.4); }
        .lg-body a:hover { border-bottom-color:var(--orange); }
        .lg-body strong { color:#111; }
        .lg-contact { margin-top:40px; padding:20px 22px; background:var(--bg2); border:1px solid var(--border); border-radius:14px; font-size:14px; }
        .lg-contact .lbl { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }

        .lg-foot-links { margin-top:48px; display:flex; flex-wrap:wrap; gap:18px; font-size:13px; }
        .lg-foot-links a { color:var(--muted); text-decoration:none; }
        .lg-foot-links a:hover { color:var(--orange); }
      `}</style>

      <nav className="lg-nav">
        <a href="/" className="lg-nav-logo">
          <img src="/logo.png" alt="Kyzer Robotics" />
          <div className="lg-nav-wordmark">
            <div className="top">Kyzer</div>
            <div className="sub">Robotics</div>
          </div>
        </a>
        <Link href="/" className="lg-back">← Home</Link>
      </nav>

      <main className="lg-wrap">
        <div className="lg-crumb">// {crumb}</div>
        <h1 className="lg-title">{title}</h1>
        {updated && <p className="lg-updated">Last updated: {updated}</p>}
        <div className="lg-body">{children}</div>

        <div className="lg-contact">
          <div className="lbl">Questions about this policy?</div>
          <div>
            Kyzer Robotics Pvt. Ltd. · Pune, Maharashtra, India<br />
            Email: <a href="mailto:info@kyzerrobotics.com">info@kyzerrobotics.com</a> · Phone:{' '}
            <a href="tel:+919049695264">+91 90496 95264</a>
          </div>
        </div>

        <div className="lg-foot-links">
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/refund-policy">Refund Policy</Link>
          <Link href="/cancellation">Cancellation Policy</Link>
          <Link href="/shipping-policy">Shipping &amp; Delivery</Link>
          <Link href="/">Back to site</Link>
        </div>
      </main>
    </>
  );
}
