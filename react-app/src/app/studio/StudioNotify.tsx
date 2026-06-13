'use client';

import { useState } from 'react';

type State = 'idle' | 'loading' | 'done' | 'error';

/** Waitlist email capture for the Kyzer Studio coming-soon page. */
export default function StudioNotify() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
      setState('error');
      return;
    }
    setState('loading');
    try {
      const r = await fetch('/api/cs-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: v, product: 'Kyzer Studio' }),
      });
      setState(r.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <p className="st-notify-done">
        ✓ You&apos;re on the list — we&apos;ll email you the moment Kyzer Studio launches.
      </p>
    );
  }

  return (
    <form className="st-notify" onSubmit={submit} noValidate>
      <input
        type="email"
        required
        placeholder="you@email.com"
        aria-label="Email address"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (state === 'error') setState('idle');
        }}
      />
      <button type="submit" disabled={state === 'loading'}>
        {state === 'loading' ? 'Adding…' : 'Notify me'}
      </button>
      {state === 'error' && <span className="st-notify-err">Please enter a valid email address.</span>}
    </form>
  );
}
