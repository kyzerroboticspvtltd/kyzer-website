import type { Metadata } from 'next';
import Link from 'next/link';
import StudioNotify from './StudioNotify';

export const metadata: Metadata = {
  title: 'Kyzer Studio — Coming Soon',
  description:
    'Kyzer Studio is a browser-based robotics IDE — write, simulate and flash Arduino, Python and ROS robot code with zero setup. Launching soon.',
  alternates: { canonical: 'https://kyzerrobotics.com/studio' },
  robots: 'index, follow',
};

const FEATURES = [
  { icon: '⚡', title: 'Live code execution', desc: 'Run Arduino, Python & ROS right in the browser — nothing to install.' },
  { icon: '🤖', title: 'Robot simulator', desc: 'Watch your code drive a virtual robot and read its sensors in real time.' },
  { icon: '🧠', title: 'AI code assistant', desc: 'Explanations, debugging and suggestions tuned for robotics.' },
  { icon: '🔌', title: 'Flash to hardware', desc: 'Push working code straight to Arduino, ESP32 and Raspberry Pi over USB.' },
];

export default function StudioComingSoon() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        :root { --orange:#FF8C35; --bg:#faf9f6; --bg2:#f2f0eb; --border:rgba(0,0,0,0.09); --text:#111; --muted:#666; }
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--text); }

        .st-nav {
          position:fixed; top:0; left:0; right:0;
          background:rgba(250,249,246,0.92); backdrop-filter:blur(12px);
          border-bottom:0.5px solid var(--border);
          display:flex; align-items:center; justify-content:space-between;
          padding:0 2rem; height:88px; z-index:100;
        }
        .st-nav-logo { display:flex; align-items:center; gap:0; text-decoration:none; }
        .st-nav-logo img { width:auto; height:88px; margin-right:-4px; filter:brightness(0) saturate(100%) invert(56%) sepia(85%) saturate(800%) hue-rotate(345deg) brightness(103%); mix-blend-mode:multiply; }
        .st-nav-wordmark .top { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--orange); letter-spacing:0.03em; line-height:1; }
        .st-nav-wordmark .sub { font-size:10px; font-weight:500; color:var(--orange); letter-spacing:0.2em; text-transform:uppercase; margin-top:3px; }
        .st-back { font-size:14px; color:var(--muted); text-decoration:none; transition:color 0.15s; }
        .st-back:hover { color:var(--text); }

        .st-wrap { max-width:880px; margin:0 auto; padding:120px 24px 90px; text-align:center; }
        .st-crumb { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--orange); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:18px; }
        .st-badge {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,140,53,0.10); border:1px solid rgba(255,140,53,0.35);
          color:#c75e12; border-radius:100px; padding:6px 16px;
          font-size:13px; font-weight:600; margin-bottom:22px;
        }
        .st-badge .dot { width:7px; height:7px; border-radius:50%; background:var(--orange); display:inline-block; animation:st-pulse 2s ease-in-out infinite; }
        @keyframes st-pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.5;transform:scale(1.35);} }

        .st-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(56px,11vw,120px); line-height:0.92; letter-spacing:0.01em; margin-bottom:18px; }
        .st-title span { color:var(--orange); }
        .st-tag { font-size:clamp(16px,2.2vw,20px); color:var(--muted); line-height:1.6; max-width:620px; margin:0 auto 40px; }

        .st-code {
          max-width:560px; margin:0 auto 52px; text-align:left;
          background:#0d1117; border:1px solid rgba(255,140,53,0.25); border-radius:14px;
          overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,0.22);
        }
        .st-code-bar { display:flex; align-items:center; gap:7px; padding:11px 16px; background:#131a24; border-bottom:1px solid rgba(255,255,255,0.06); }
        .st-code-bar i { width:11px; height:11px; border-radius:50%; display:inline-block; }
        .st-code-bar .f { margin-left:10px; font-family:'JetBrains Mono',monospace; font-size:12px; color:#8b98a9; }
        .st-code pre { margin:0; padding:18px 20px; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.75; color:#c9d4e0; overflow-x:auto; }
        .st-code .k { color:#ff9d5c; } .st-code .c { color:#5b6b7d; } .st-code .s { color:#7fd99a; } .st-code .n { color:#d6a4ff; }

        .st-features { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; max-width:760px; margin:0 auto 56px; text-align:left; }
        .st-feat { background:#fff; border:1px solid var(--border); border-radius:14px; padding:20px; }
        .st-feat .ic { font-size:24px; margin-bottom:10px; }
        .st-feat h3 { font-size:15px; font-weight:700; margin-bottom:6px; color:#111; }
        .st-feat p { font-size:13px; color:var(--muted); line-height:1.55; }

        .st-notify-wrap { max-width:480px; margin:0 auto; background:var(--bg2); border:1px solid var(--border); border-radius:18px; padding:28px 26px; }
        .st-notify-label { font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted); margin-bottom:14px; }
        .st-notify { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
        .st-notify input { flex:1; min-width:200px; padding:12px 16px; border:1px solid var(--border); border-radius:10px; font-size:15px; font-family:'DM Sans',sans-serif; background:#fff; color:#111; outline:none; }
        .st-notify input:focus { border-color:var(--orange); box-shadow:0 0 0 3px rgba(255,140,53,0.15); }
        .st-notify button { padding:12px 22px; background:var(--orange); color:#111; border:none; border-radius:10px; font-size:15px; font-weight:700; cursor:pointer; transition:transform .15s,box-shadow .2s; font-family:'DM Sans',sans-serif; }
        .st-notify button:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 20px rgba(255,140,53,0.35); }
        .st-notify button:disabled { opacity:.7; cursor:default; }
        .st-notify-err { flex-basis:100%; font-size:13px; color:#c0392b; margin-top:2px; }
        .st-notify-done { font-size:15px; color:#1a7a40; font-weight:500; line-height:1.5; }

        .st-home { display:inline-block; margin-top:44px; font-size:14px; color:var(--muted); text-decoration:none; }
        .st-home:hover { color:var(--orange); }
      `}</style>

      <nav className="st-nav">
        <a href="/" className="st-nav-logo">
          <img src="/logo.png" alt="Kyzer Robotics" />
          <div className="st-nav-wordmark">
            <div className="top">Kyzer</div>
            <div className="sub">Robotics</div>
          </div>
        </a>
        <Link href="/" className="st-back">← Home</Link>
      </nav>

      <main className="st-wrap">
        <div className="st-crumb">// New from Kyzer Robotics</div>
        <div className="st-badge"><span className="dot" /> Coming soon</div>
        <h1 className="st-title">Kyzer <span>Studio</span></h1>
        <p className="st-tag">
          A browser-based robotics IDE. Write, simulate and flash Arduino, Python and ROS
          robot code — straight from your browser, with zero setup.
        </p>

        <div className="st-code">
          <div className="st-code-bar">
            <i style={{ background: '#ff5f57' }} />
            <i style={{ background: '#febc2e' }} />
            <i style={{ background: '#28c840' }} />
            <span className="f">line_follower.py</span>
          </div>
          <pre>
            <span className="c"># Kyzer Studio — line follower</span>{'\n'}
            <span className="k">import</span> kyzer <span className="k">as</span> kz{'\n\n'}
            <span className="k">def</span> loop():{'\n'}
            {'  '}line = kz.sensor.read(<span className="s">&quot;IR_ARRAY&quot;</span>){'\n'}
            {'  '}<span className="k">if</span> line[<span className="n">2</span>]:{'\n'}
            {'    '}kz.motor.forward(speed=<span className="n">0.7</span>){'\n'}
            {'  '}<span className="k">else</span>:{'\n'}
            {'    '}kz.motor.correct(line)
          </pre>
        </div>

        <div className="st-features">
          {FEATURES.map((f) => (
            <div className="st-feat" key={f.title}>
              <div className="ic">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="st-notify-wrap">
          <div className="st-notify-label">Be first to try it</div>
          <StudioNotify />
        </div>

        <Link className="st-home" href="/">← Back to Kyzer Robotics</Link>
      </main>
    </>
  );
}
