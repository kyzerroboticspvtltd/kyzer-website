'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const CSS = `
  @keyframes pt-fade-in  { from { opacity:0; } to { opacity:1; } }
  @keyframes pt-fade-out { from { opacity:1; } to { opacity:0; } }
  @keyframes pt-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes pt-blink  { 0%,88%,100%{opacity:1} 94%{opacity:0} }
  @keyframes pt-arm    { 0%,100%{transform:rotate(0deg)} 40%,60%{transform:rotate(-22deg)} }
  @keyframes pt-belt   { from{transform:translateX(0)} to{transform:translateX(-24px)} }
  @keyframes pt-box    { 0%{transform:translateX(-8px);opacity:0} 8%{opacity:1} 74%{transform:translateX(92px);opacity:1} 88%,100%{transform:translateX(112px);opacity:0} }
  @keyframes pt-ping   { 0%,100%{r:3;opacity:1} 50%{r:5.5;opacity:0.35} }
  @keyframes pt-scan   { 0%,100%{opacity:.15} 50%{opacity:.95} }
  @keyframes pt-dot    { 0%,80%,100%{opacity:.2;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }

  .pt-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: #f9f9f7;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    pointer-events: none;
  }
  .pt-overlay.pt-in  { animation: pt-fade-in  0.18s ease forwards; }
  .pt-overlay.pt-out { animation: pt-fade-out 0.22s ease forwards; }

  .pt-robot   { animation: pt-float 3s ease-in-out infinite; }
  .pt-eye     { animation: pt-blink 4s ease-in-out infinite; }
  .pt-arm     { transform-origin: 78px 104px; animation: pt-arm 1.8s ease-in-out infinite; }
  .pt-belt-s  { animation: pt-belt 0.6s linear infinite; }
  .pt-box     { animation: pt-box 2.4s ease-in-out infinite; }
  .pt-ping    { animation: pt-ping 1.4s ease-in-out infinite; }
  .pt-scan    { animation: pt-scan 1.8s ease-in-out infinite; }
  .pt-d1      { animation: pt-dot 1.4s 0.00s ease-in-out infinite; display:inline-block; }
  .pt-d2      { animation: pt-dot 1.4s 0.20s ease-in-out infinite; display:inline-block; }
  .pt-d3      { animation: pt-dot 1.4s 0.40s ease-in-out infinite; display:inline-block; }
`;

export default function PageTransition() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase]     = useState<'in'|'out'>('in');
  const prevPath = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    if (timerRef.current) clearTimeout(timerRef.current);

    // show overlay
    setPhase('in');
    setVisible(true);

    // after 550ms start fading out
    timerRef.current = setTimeout(() => {
      setPhase('out');
      // after fade-out animation (220ms) hide completely
      timerRef.current = setTimeout(() => setVisible(false), 230);
    }, 550);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`pt-overlay pt-${phase}`} aria-hidden="true">
        <div className="pt-robot">
          <svg width="220" height="190" viewBox="0 0 260 220" fill="none">
            <ellipse cx="130" cy="210" rx="52" ry="6" fill="#e0ddd7" opacity="0.6"/>

            {/* belt */}
            <rect x="40" y="168" width="180" height="18" rx="9" fill="#e8e4dc"/>
            <clipPath id="ptbc"><rect x="49" y="168" width="162" height="18" rx="9"/></clipPath>
            <g clipPath="url(#ptbc)">
              <g className="pt-belt-s">
                {[0,24,48,72,96,120,144,168,192].map(x => (
                  <rect key={x} x={x+49} y="172" width="14" height="10" rx="2" fill="#ddd8ce" opacity="0.8"/>
                ))}
              </g>
            </g>
            <circle cx="49"  cy="177" r="9" fill="#d5d0c6"/>
            <circle cx="211" cy="177" r="9" fill="#d5d0c6"/>

            {/* box */}
            <g className="pt-box">
              <rect x="40" y="143" width="38" height="28" rx="5" fill="#FF8C35"/>
              <rect x="40" y="143" width="38" height="9"  rx="5" fill="#e07520"/>
              <rect x="40" y="147" width="38" height="5"       fill="#e07520"/>
              <rect x="57" y="143" width="5"  height="28" rx="1" fill="rgba(255,255,255,0.28)"/>
              <rect x="40" y="154" width="38" height="4"  rx="1" fill="rgba(255,255,255,0.2)"/>
              <rect x="45" y="157" width="22" height="10" rx="2" fill="white" opacity="0.95"/>
              <rect x="47" y="160" width="14" height="1.5" rx="1" fill="#ccc"/>
              <rect x="47" y="163" width="10" height="1.5" rx="1" fill="#ccc"/>
            </g>

            {/* body */}
            <rect x="86"  y="96"  width="68" height="72" rx="14" fill="#1e1e1e"/>
            <rect x="90"  y="100" width="60" height="64" rx="11" fill="#2a2a2a"/>
            {/* chest */}
            <rect x="98"  y="108" width="44" height="32" rx="7" fill="#111"/>
            <rect x="100" y="110" width="40" height="28" rx="6" fill="#0d1a0d"/>
            <rect x="102" y="120" width="36" height="2"  rx="1" fill="#FF8C35" opacity="0.9" className="pt-scan"/>
            <rect x="102" y="114" width="28" height="1.5" rx="1" fill="#3ddc84" opacity="0.7"/>
            <rect x="102" y="117" width="20" height="1.5" rx="1" fill="#3ddc84" opacity="0.5"/>
            <rect x="102" y="124" width="32" height="1.5" rx="1" fill="#3ddc84" opacity="0.6"/>
            <rect x="102" y="127" width="18" height="1.5" rx="1" fill="#3ddc84" opacity="0.4"/>
            <rect x="102" y="130" width="24" height="1.5" rx="1" fill="#3ddc84" opacity="0.5"/>
            <circle cx="106" cy="147" r="3.5" fill="#FF8C35" opacity="0.9"/>
            <circle cx="116" cy="147" r="3.5" fill="#3ddc84" opacity="0.9"/>
            <circle cx="126" cy="147" r="3.5" fill="#3ddc84" opacity="0.5"/>

            {/* head */}
            <rect x="92" y="60" width="56" height="40" rx="14" fill="#1e1e1e"/>
            <rect x="96" y="64" width="48" height="32" rx="11" fill="#2a2a2a"/>
            <rect x="103" y="72" width="14" height="10" rx="5" fill="#111" className="pt-eye"/>
            <rect x="123" y="72" width="14" height="10" rx="5" fill="#111" className="pt-eye"/>
            <rect x="105" y="74" width="10" height="6"  rx="3" fill="#FF8C35" className="pt-eye"/>
            <rect x="125" y="74" width="10" height="6"  rx="3" fill="#FF8C35" className="pt-eye"/>
            <circle cx="108" cy="76" r="1.5" fill="white" opacity="0.7"/>
            <circle cx="128" cy="76" r="1.5" fill="white" opacity="0.7"/>
            <rect x="108" y="86" width="24" height="3"  rx="1.5" fill="#111"/>
            <rect x="112" y="87" width="16" height="1.5" rx="1" fill="#3ddc84" opacity="0.6"/>

            {/* antenna */}
            <rect x="118" y="48" width="4"  height="14" rx="2" fill="#333"/>
            <circle cx="120" cy="46" r="5" fill="#1e1e1e"/>
            <circle cx="120" cy="46" r="3" fill="#FF8C35" className="pt-ping"/>

            {/* left arm */}
            <g className="pt-arm">
              <rect x="72" y="100" width="16" height="36" rx="8" fill="#1e1e1e"/>
              <rect x="74" y="102" width="12" height="32" rx="6" fill="#2a2a2a"/>
              <rect x="62" y="130" width="22" height="10" rx="5" fill="#FF8C35"/>
              <rect x="64" y="133" width="18" height="4"  rx="2" fill="#e07520"/>
              <rect x="71" y="131" width="2"  height="8"  rx="1" fill="rgba(255,255,255,0.4)"/>
            </g>

            {/* right arm */}
            <rect x="152" y="100" width="16" height="28" rx="8" fill="#1e1e1e"/>
            <rect x="154" y="102" width="12" height="24" rx="6" fill="#2a2a2a"/>
            <rect x="156" y="126" width="6"  height="8"  rx="3" fill="#333"/>
            <rect x="163" y="126" width="6"  height="8"  rx="3" fill="#333"/>

            {/* legs */}
            <rect x="100" y="166" width="18" height="22" rx="8" fill="#1e1e1e"/>
            <rect x="122" y="166" width="18" height="22" rx="8" fill="#1e1e1e"/>
            <rect x="96"  y="182" width="26" height="8"  rx="5" fill="#161616"/>
            <rect x="118" y="182" width="26" height="8"  rx="5" fill="#161616"/>
          </svg>
        </div>

        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#aaa', marginTop:4, letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:500 }}>
          Loading<span className="pt-d1">·</span><span className="pt-d2">·</span><span className="pt-d3">·</span>
        </p>
      </div>
    </>
  );
}
