'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const CSS = `
  @keyframes pt-in  { from { opacity:0; } to { opacity:1; } }
  @keyframes pt-out { from { opacity:1; } to { opacity:0; } }
  @keyframes pt-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }

  .pt-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: #f9f9f7;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none;
  }
  .pt-overlay.pt-in  { animation: pt-in  0.18s ease forwards; }
  .pt-overlay.pt-out { animation: pt-out 0.22s ease forwards; }
  .pt-logo { animation: pt-pulse 1.2s ease-in-out infinite; }
`;

export default function PageTransition() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase]     = useState<'in' | 'out'>('in');
  const prevPath = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    if (timerRef.current) clearTimeout(timerRef.current);

    setPhase('in');
    setVisible(true);

    timerRef.current = setTimeout(() => {
      setPhase('out');
      timerRef.current = setTimeout(() => setVisible(false), 230);
    }, 500);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`pt-overlay pt-${phase}`} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Kyzer Robotics" className="pt-logo" style={{ width: 90, height: 'auto', objectFit: 'contain' }} />
      </div>
    </>
  );
}
