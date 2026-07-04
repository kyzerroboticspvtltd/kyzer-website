'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const CSS = `
  @keyframes kzFill {
    0%   { width: 4px; }
    50%  { width: calc(100% - 6px); }
    100% { width: 4px; }
  }
  @keyframes kzShimmer {
    0%   { background-position: 0% 0%; }
    100% { background-position: 200% 0%; }
  }
  @keyframes kzPulse {
    0%, 100% { opacity: 0.6; }
    50%       { opacity: 1; }
  }
  @keyframes kzBlink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
  @keyframes kzFadeIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes kzFadeOut { from { opacity: 1; } to { opacity: 0; } }

  .kz-pt-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: #f8f8f6;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 18px;
    font-family: 'DM Sans', system-ui, sans-serif;
    pointer-events: none;
  }
  .kz-pt-overlay.kz-in  { animation: kzFadeIn  0.15s ease forwards; }
  .kz-pt-overlay.kz-out { animation: kzFadeOut 0.2s ease forwards; }

  .kz-pt-logo-word {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px; color: #FF8C35; letter-spacing: 0.06em;
  }
  .kz-pt-logo-sub {
    font-size: 9px; font-weight: 600; letter-spacing: 0.2em;
    color: #888; vertical-align: middle; margin-left: 5px;
  }
  .kz-pt-track {
    position: relative; width: 200px; height: 34px;
    background: linear-gradient(135deg, #e8e5df, #dedad2);
    border-radius: 17px; overflow: hidden;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.12), 0 1px 3px rgba(255,255,255,0.9);
  }
  .kz-pt-fill {
    position: absolute; top: 3px; left: 3px;
    height: calc(100% - 6px); border-radius: 14px;
    background: linear-gradient(90deg, #FF8C35, #ff6b00, #FF8C35, #ffb347);
    background-size: 200% 100%;
    box-shadow: 0 0 14px rgba(255,140,53,0.5), inset 0 1px 2px rgba(255,255,255,0.3);
    animation: kzFill 2.4s ease-in-out infinite, kzShimmer 1.8s linear infinite;
  }
  .kz-pt-text {
    font-size: 14px; font-weight: 600; color: #555;
    letter-spacing: 0.08em;
    animation: kzPulse 1.2s ease-in-out infinite;
    display: flex; align-items: center; gap: 1px;
  }
  .kz-pt-dot1 { animation: kzBlink 1.5s infinite 0s; }
  .kz-pt-dot2 { animation: kzBlink 1.5s infinite 0.3s; }
  .kz-pt-dot3 { animation: kzBlink 1.5s infinite 0.6s; }
`;

export default function PageTransition() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const prevPath = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show loader on link click (navigation start)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('/') || href.startsWith('//')) return;
      // Skip same-page anchors
      const path = href.split('?')[0].split('#')[0];
      if (path === pathname || path === '') return;
      // Skip download links
      if (anchor.hasAttribute('download')) return;
      // Skip target="_blank"
      if (anchor.getAttribute('target') === '_blank') return;

      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase('in');
      setVisible(true);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname]);

  // Hide loader when new page is rendered (pathname changed)
  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('out');
    timerRef.current = setTimeout(() => setVisible(false), 220);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`kz-pt-overlay kz-${phase}`} aria-hidden="true">
        <div>
          <span className="kz-pt-logo-word">KYZER</span>
          <span className="kz-pt-logo-sub">ROBOTICS</span>
        </div>
        <div className="kz-pt-track">
          <div className="kz-pt-fill" />
        </div>
        <div className="kz-pt-text">
          Loading
          <span className="kz-pt-dot1">.</span>
          <span className="kz-pt-dot2">.</span>
          <span className="kz-pt-dot3">.</span>
        </div>
      </div>
    </>
  );
}
