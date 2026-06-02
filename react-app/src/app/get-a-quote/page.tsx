'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';

const PROJECT_TYPES = [
  { key: 'drone',      label: 'Custom Drone',       icon: '🛸' },
  { key: '3dprint',    label: '3D Printing',         icon: '🖨️' },
  { key: 'electronics',label: 'Electronics / PCB',   icon: '💡' },
  { key: 'robotics',   label: 'Robotics / Arm',      icon: '🦾' },
  { key: 'prototype',  label: 'Prototype / R&D',     icon: '🧪' },
  { key: 'other',      label: 'Other',               icon: '✨' },
];

const BUDGETS = ['Under ₹5,000', '₹5,000 – ₹20,000', '₹20,000 – ₹1,00,000', '₹1,00,000+', 'Not sure yet'];
const TIMELINES = ['ASAP', 'Within 1 week', '1 – 4 weeks', '1 – 3 months', 'Flexible'];

export default function GetAQuotePage() {
  const [projectType, setProjectType] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const allowed = Array.from(files).filter(f => f.type.startsWith('image/'));
    setImages(prev => [...prev, ...allowed].slice(0, 5));
  }

  function removeImage(i: number) {
    setImages(prev => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set('projectType', projectType);
    images.forEach(f => data.append('refImages', f));

    setSubmitting(true);
    try {
      const res = await fetch('/api/quote-inquiry', { method: 'POST', body: data });
      if (!res.ok) throw new Error('failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong — please try WhatsApp or email below.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px,6vw,56px)', color: '#111', marginBottom: 8 }}>We Got It!</h1>
        <p style={{ color: '#666', fontSize: 16, textAlign: 'center', maxWidth: 480, marginBottom: 32 }}>
          Thanks for reaching out. We'll review your project and get back to you within a few hours.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="https://wa.me/919049695264" target="_blank" rel="noopener" style={{ background: '#25D366', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 600, textDecoration: 'none', fontSize: 15 }}>
            Chat on WhatsApp
          </a>
          <Link href="/" style={{ background: '#f0f0ee', color: '#111', padding: '12px 24px', borderRadius: 10, fontWeight: 500, textDecoration: 'none', fontSize: 15 }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        :root {
          --orange: #FF8C35;
          --bg: #faf9f6;
          --bg2: #f2f0eb;
          --border: rgba(0,0,0,0.09);
          --text: #111;
          --muted: #666;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

        .gaq-nav {
          position: fixed; top: 0; left: 0; right: 0;
          background: rgba(250,249,246,0.92); backdrop-filter: blur(12px);
          border-bottom: 0.5px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem; height: 64px; z-index: 100;
        }
        .gaq-nav-logo {
          display: flex; align-items: center; gap: 0; text-decoration: none;
        }
        .gaq-nav-logo img {
          width: 46px; height: 46px;
          border-radius: 10px; object-fit: cover; margin-right: 8px;
        }
        .gaq-nav-wordmark { line-height: 1; }
        .gaq-nav-wordmark .top { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: var(--orange); letter-spacing: 0.03em; }
        .gaq-nav-wordmark .sub { font-size: 10px; font-weight: 500; color: var(--orange); letter-spacing: 0.22em; text-transform: uppercase; margin-top: 1px; }
        .gaq-back { font-size: 14px; color: var(--muted); text-decoration: none; display: flex; align-items: center; gap: 6px; transition: color 0.15s; }
        .gaq-back:hover { color: var(--text); }

        .gaq-wrap { max-width: 720px; margin: 0 auto; padding: 96px 24px 80px; }
        .gaq-heading { font-family: 'Bebas Neue', sans-serif; font-size: clamp(42px,7vw,72px); color: #111; line-height: 0.95; margin-bottom: 10px; }
        .gaq-sub { font-size: 16px; color: var(--muted); margin-bottom: 48px; }

        .gaq-section { margin-bottom: 36px; }
        .gaq-label { font-size: 13px; font-weight: 600; color: #111; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; }

        .gaq-type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        @media (max-width: 540px) { .gaq-type-grid { grid-template-columns: repeat(2, 1fr); } }
        .gaq-type-card {
          border: 1.5px solid var(--border); border-radius: 12px;
          padding: 16px 12px; text-align: center; cursor: pointer;
          transition: all 0.18s; background: #fff;
        }
        .gaq-type-card:hover { border-color: var(--orange); }
        .gaq-type-card.selected { border-color: var(--orange); background: #fff3e8; }
        .gaq-type-icon { font-size: 26px; margin-bottom: 6px; }
        .gaq-type-label { font-size: 13px; font-weight: 500; color: #333; }

        .gaq-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 540px) { .gaq-row { grid-template-columns: 1fr; } }
        .gaq-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .gaq-field label { font-size: 13px; font-weight: 500; color: #444; }
        .gaq-field input, .gaq-field textarea, .gaq-field select {
          background: #fff; border: 1.5px solid var(--border);
          border-radius: 10px; padding: 12px 14px;
          font-size: 15px; font-family: 'DM Sans', sans-serif; color: #111;
          transition: border-color 0.18s; width: 100%; outline: none;
          resize: none;
        }
        .gaq-field input:focus, .gaq-field textarea:focus, .gaq-field select:focus { border-color: var(--orange); }
        .gaq-field select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }

        .gaq-upload {
          border: 2px dashed var(--border); border-radius: 12px;
          padding: 28px; text-align: center; cursor: pointer;
          transition: border-color 0.18s; background: #fff; position: relative;
        }
        .gaq-upload:hover { border-color: var(--orange); }
        .gaq-upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .gaq-upload-icon { font-size: 32px; margin-bottom: 8px; }
        .gaq-upload p { font-size: 14px; color: var(--muted); }
        .gaq-upload span { font-size: 12px; color: #aaa; margin-top: 4px; display: block; }

        .gaq-previews { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; }
        .gaq-preview {
          position: relative; width: 80px; height: 80px;
          border-radius: 8px; overflow: hidden; border: 1.5px solid var(--border);
        }
        .gaq-preview img { width: 100%; height: 100%; object-fit: cover; }
        .gaq-preview-rm {
          position: absolute; top: 3px; right: 3px;
          background: rgba(0,0,0,0.55); color: #fff; border: none;
          border-radius: 50%; width: 20px; height: 20px; font-size: 12px;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }

        .gaq-submit {
          width: 100%; background: var(--orange); color: #111;
          border: none; border-radius: 12px; padding: 16px;
          font-size: 16px; font-weight: 700; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background 0.18s, transform 0.15s; margin-top: 8px;
        }
        .gaq-submit:hover { background: #e07b20; transform: translateY(-2px); }
        .gaq-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .gaq-error { color: #c0392b; font-size: 14px; margin-top: 10px; text-align: center; }

        .gaq-divider { display: flex; align-items: center; gap: 14px; margin: 40px 0 28px; }
        .gaq-divider-line { flex: 1; height: 1px; background: var(--border); }
        .gaq-divider-text { font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap; }

        .gaq-contact { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) { .gaq-contact { grid-template-columns: 1fr; } }
        .gaq-contact-card {
          border: 1.5px solid var(--border); border-radius: 14px;
          padding: 20px; text-align: center; text-decoration: none;
          transition: all 0.18s; background: #fff;
        }
        .gaq-contact-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .gaq-contact-card.whatsapp { border-color: #25D366; }
        .gaq-contact-card.whatsapp:hover { background: #f0fff4; }
        .gaq-contact-card.email:hover { background: #fff3e8; border-color: var(--orange); }
        .gaq-contact-icon { font-size: 28px; margin-bottom: 8px; }
        .gaq-contact-title { font-size: 15px; font-weight: 600; color: #111; margin-bottom: 4px; }
        .gaq-contact-desc { font-size: 12px; color: var(--muted); }
        .gaq-contact-handle { font-size: 13px; font-weight: 500; color: var(--muted); margin-top: 6px; }
      `}</style>

      {/* NAV */}
      <nav className="gaq-nav">
        <a href="/" className="gaq-nav-logo">
          <img src="/Kyzer Logo-03.png" alt="Kyzer Robotics" />
          <div className="gaq-nav-wordmark">
            <div className="top">Kyzer</div>
            <div className="sub">Robotics</div>
          </div>
        </a>
        <Link href="/" className="gaq-back">← Back to site</Link>
      </nav>

      <div className="gaq-wrap">
        <h1 className="gaq-heading">Get a<br />Quote</h1>
        <p className="gaq-sub">Tell us about your project and we'll get back to you within hours.</p>

        <form onSubmit={handleSubmit}>
          {/* Project type */}
          <div className="gaq-section">
            <div className="gaq-label">What are you building?</div>
            <div className="gaq-type-grid">
              {PROJECT_TYPES.map(t => (
                <div
                  key={t.key}
                  className={`gaq-type-card${projectType === t.key ? ' selected' : ''}`}
                  onClick={() => setProjectType(t.key)}
                >
                  <div className="gaq-type-icon">{t.icon}</div>
                  <div className="gaq-type-label">{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal info */}
          <div className="gaq-section">
            <div className="gaq-label">Your Details</div>
            <div className="gaq-row">
              <div className="gaq-field">
                <label>Full Name *</label>
                <input name="name" type="text" placeholder="Rahul Sharma" required />
              </div>
              <div className="gaq-field">
                <label>WhatsApp / Phone *</label>
                <input name="phone" type="tel" placeholder="+91 98765 43210" required />
              </div>
            </div>
            <div className="gaq-field">
              <label>Email *</label>
              <input name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="gaq-field">
              <label>Organization / College <span style={{color:'#aaa',fontWeight:400}}>(optional)</span></label>
              <input name="org" type="text" placeholder="e.g. IIT Pune, Startup XYZ" />
            </div>
          </div>

          {/* Project details */}
          <div className="gaq-section">
            <div className="gaq-label">Project Details</div>
            <div className="gaq-field">
              <label>Describe your project *</label>
              <textarea name="description" rows={5} placeholder="What do you want to build? What is it for? Any specific requirements or constraints?" required />
            </div>
            <div className="gaq-row">
              <div className="gaq-field">
                <label>Timeline</label>
                <select name="timeline">
                  <option value="">Select timeline</option>
                  {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="gaq-field">
                <label>Budget Range</label>
                <select name="budget">
                  <option value="">Select budget</option>
                  {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Reference images */}
          <div className="gaq-section">
            <div className="gaq-label">Reference Images <span style={{fontWeight:400,textTransform:'none',letterSpacing:0,fontSize:12,color:'#aaa'}}>(up to 5, optional)</span></div>
            <div className="gaq-upload" onClick={() => fileRef.current?.click()}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={e => handleFiles(e.target.files)}
                style={{ display: 'none' }}
              />
              <div className="gaq-upload-icon">📎</div>
              <p>Click to upload reference images</p>
              <span>JPG, PNG, WEBP — max 5 files</span>
            </div>
            {images.length > 0 && (
              <div className="gaq-previews">
                {images.map((img, i) => (
                  <div key={i} className="gaq-preview">
                    <img src={URL.createObjectURL(img)} alt={img.name} />
                    <button type="button" className="gaq-preview-rm" onClick={() => removeImage(i)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="gaq-submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send My Project Details →'}
          </button>
          {error && <p className="gaq-error">{error}</p>}
        </form>

        {/* Contact strip */}
        <div className="gaq-divider">
          <div className="gaq-divider-line" />
          <div className="gaq-divider-text">or contact us directly</div>
          <div className="gaq-divider-line" />
        </div>

        <div className="gaq-contact">
          <a href="https://wa.me/919049695264" target="_blank" rel="noopener" className="gaq-contact-card whatsapp">
            <div className="gaq-contact-icon">💬</div>
            <div className="gaq-contact-title">WhatsApp</div>
            <div className="gaq-contact-desc">Chat with us directly — fastest response</div>
            <div className="gaq-contact-handle">+91 90496 95264</div>
          </a>
          <a href="mailto:info@kyzerrobotics.com" className="gaq-contact-card email">
            <div className="gaq-contact-icon">✉️</div>
            <div className="gaq-contact-title">Email</div>
            <div className="gaq-contact-desc">For detailed briefs and attachments</div>
            <div className="gaq-contact-handle">info@kyzerrobotics.com</div>
          </a>
        </div>
      </div>
    </>
  );
}
