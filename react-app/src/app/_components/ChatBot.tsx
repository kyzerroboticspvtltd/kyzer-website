'use client';

import { useState, useRef, useEffect } from 'react';

const WA_NUMBER = '919049695264';
const WA_LINK = `https://wa.me/${WA_NUMBER}`;

interface Message {
  from: 'bot' | 'user';
  text: string;
}

interface FAQ {
  q: string;
  keywords: string[];
  a: string;
}

const FAQS: FAQ[] = [
  {
    q: 'How do I place an order?',
    keywords: ['order', 'buy', 'purchase', 'how to order', 'place order'],
    a: 'You can shop directly on our website — browse <a href="/shop/drones">Drones</a>, <a href="/shop/electronics">Electronics</a>, or <a href="/shop/printing">3D Printing</a>, add items to cart, and checkout. We accept online payments and COD.',
  },
  {
    q: 'Do you offer 3D printing services?',
    keywords: ['3d print', '3d printing', 'print', 'fdm', 'pla', 'abs', 'petg', 'tpu', 'nylon', 'prototype'],
    a: '✅ Yes! We offer FDM 3D printing in PLA, ABS, PETG, TPU, and Nylon with a 48-hour turnaround. <a href="/shop/printing">Get a 3D print quote here</a>.',
  },
  {
    q: 'What drones do you sell?',
    keywords: ['drone', 'fpv', 'quadcopter', 'uav', 'aerial', 'survey drone', 'agricultural drone'],
    a: 'We build and sell FPV racing drones, survey drones, agricultural drones, and drone frames. Browse our <a href="/shop/drones">drone collection</a> or <a href="/contact">contact us</a> for a custom build.',
  },
  {
    q: 'What are your delivery / shipping charges?',
    keywords: ['shipping', 'delivery', 'courier', 'charges', 'free shipping', 'ship'],
    a: 'Shipping charges depend on your location and order weight. Free shipping is available on qualifying orders. Check the <a href="/shipping-policy">Shipping Policy</a> for full details.',
  },
  {
    q: 'How long does delivery take?',
    keywords: ['how long', 'delivery time', 'days', 'when will i get', 'estimated delivery', 'edd'],
    a: 'Standard delivery takes 5–7 business days within India. 3D printed items have a 48-hour production time before shipping.',
  },
  {
    q: 'Can I cancel or return my order?',
    keywords: ['cancel', 'return', 'refund', 'exchange', 'cancellation'],
    a: 'Orders can be cancelled before dispatch. Returns and refunds are covered in our <a href="/refund-policy">Refund Policy</a> and <a href="/cancellation">Cancellation Policy</a>.',
  },
  {
    q: 'How do I track my order?',
    keywords: ['track', 'tracking', 'where is my order', 'status', 'order status'],
    a: 'Log in to your account and visit the <a href="/customer/dashboard">Customer Dashboard</a> to view your order status and tracking details.',
  },
  {
    q: 'Do you accept COD (Cash on Delivery)?',
    keywords: ['cod', 'cash on delivery', 'cash', 'pay on delivery'],
    a: '✅ Yes, we accept Cash on Delivery for most orders within India.',
  },
  {
    q: 'What electronics do you carry?',
    keywords: ['electronics', 'arduino', 'components', 'modules', 'sensors', 'microcontroller'],
    a: 'We stock Arduino boards, sensors, modules, and various electronics components. Browse <a href="/shop/electronics">Electronics</a> or <a href="/shop/electronics/arduino">Arduino</a>.',
  },
  {
    q: 'Do you build custom drones or robots?',
    keywords: ['custom', 'custom build', 'custom drone', 'custom robot', 'bespoke', 'tailored'],
    a: 'Yes! We do end-to-end custom engineering — from concept and CAD to fabrication and delivery. <a href="/contact">Contact us</a> with your requirements.',
  },
  {
    q: 'Where are you located?',
    keywords: ['location', 'address', 'where', 'pune', 'office', 'visit'],
    a: 'We are based in Pune, Maharashtra, India. Reach us at <a href="/contact">Contact page</a> or WhatsApp us directly.',
  },
  {
    q: 'How do I contact support?',
    keywords: ['contact', 'support', 'help', 'email', 'phone', 'reach'],
    a: 'You can reach us via <a href="/contact">our contact form</a>, email at <a href="mailto:info@kyzerrobotics.com">info@kyzerrobotics.com</a>, or WhatsApp below.',
  },
];

const GREETINGS = ['hi', 'hello', 'hey', 'hii', 'helo', 'yo', 'namaste'];

function findAnswer(input: string): string | null {
  const q = input.toLowerCase().trim();
  if (GREETINGS.some(g => q === g || q.startsWith(g + ' '))) {
    return "Hi there! 👋 I'm the Kyzer assistant. Ask me anything about our products, orders, 3D printing, shipping, or more!";
  }
  for (const faq of FAQS) {
    if (faq.keywords.some(k => q.includes(k))) return faq.a;
  }
  return null;
}

type TicketStep = null | 'ask_name' | 'ask_email' | 'ask_subject' | 'ask_message' | 'done';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: "Hi! 👋 I'm the Kyzer assistant. Ask me anything or pick a question below." },
  ]);
  const [input, setInput] = useState('');
  const [showFAQs, setShowFAQs] = useState(true);
  const [ticketStep, setTicketStep] = useState<TicketStep>(null);
  const [ticketData, setTicketData] = useState<Record<string, string>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function submitTicket(data: Record<string, string>) {
    try {
      await fetch('/api/support-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {}
  }

  function startTicket() {
    setTicketStep('ask_name');
    setTicketData({});
    setShowFAQs(false);
    setMessages(prev => [...prev,
      { from: 'bot', text: "Sure! Let's raise a support ticket. What's your name?" },
    ]);
  }

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { from: 'user', text };
    setInput('');

    if (ticketStep) {
      setMessages(prev => [...prev, userMsg]);
      handleTicketStep(text);
      return;
    }

    const answer = findAnswer(text);
    const botMsg: Message = {
      from: 'bot',
      text: answer ?? "I'm not sure about that. You can raise a support ticket or WhatsApp us! 👇",
    };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setShowFAQs(false);
  }

  function handleTicketStep(value: string) {
    if (ticketStep === 'ask_name') {
      setTicketData(d => ({ ...d, name: value }));
      setTicketStep('ask_email');
      setMessages(prev => [...prev, { from: 'bot', text: "What's your email address?" }]);
    } else if (ticketStep === 'ask_email') {
      setTicketData(d => ({ ...d, email: value }));
      setTicketStep('ask_subject');
      setMessages(prev => [...prev, { from: 'bot', text: "What's the subject of your issue?" }]);
    } else if (ticketStep === 'ask_subject') {
      setTicketData(d => ({ ...d, subject: value }));
      setTicketStep('ask_message');
      setMessages(prev => [...prev, { from: 'bot', text: "Please describe your issue in detail." }]);
    } else if (ticketStep === 'ask_message') {
      const finalData: Record<string, string> = { ...ticketData, message: value, source: 'chatbot' };
      setTicketData(finalData);
      setTicketStep('done');
      submitTicket(finalData);
      const customerEmail = ticketData['email'] ?? '';
      setMessages(prev => [...prev, {
        from: 'bot',
        text: `✅ Ticket raised! We'll get back to you at <strong>${customerEmail}</strong> shortly. You can also WhatsApp us for faster support.`,
      }]);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open chat"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: '#FF8C35', border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(255,140,53,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 28, zIndex: 9998,
          width: 340, maxHeight: '70vh',
          background: '#f8f8f6', borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          fontFamily: "'DM Sans', sans-serif", overflow: 'hidden',
          border: '0.5px solid rgba(0,0,0,0.1)',
        }}>
          {/* Header */}
          <div style={{
            background: '#FF8C35', padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8C35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>Kyzer Support</div>
              <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.6)' }}>Usually replies instantly</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 0' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 10,
              }}>
                <div
                  style={{
                    maxWidth: '82%',
                    background: m.from === 'user' ? '#FF8C35' : '#fff',
                    color: m.from === 'user' ? '#111' : '#1a1a1a',
                    borderRadius: m.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    padding: '9px 13px', fontSize: 13, lineHeight: 1.5,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  }}
                  dangerouslySetInnerHTML={{ __html: m.text }}
                />
              </div>
            ))}

            {/* Action CTAs after first bot reply */}
            {messages.length > 1 && !ticketStep && (
              <div style={{ textAlign: 'center', marginBottom: 12, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#25D366', color: '#fff', borderRadius: 8,
                    padding: '7px 12px', fontSize: 12, fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <button
                  onClick={startTicket}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#FF8C35', color: '#111', border: 'none', borderRadius: 8,
                    padding: '7px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  🎫 Raise Ticket
                </button>
              </div>
            )}

            {/* Suggested FAQs */}
            {showFAQs && (
              <div style={{ marginBottom: 12 }}>
                {FAQS.slice(0, 6).map((faq, i) => (
                  <button
                    key={i}
                    onClick={() => send(faq.q)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      background: '#fff', border: '0.5px solid rgba(0,0,0,0.12)',
                      borderRadius: 8, padding: '8px 12px', marginBottom: 6,
                      fontSize: 12.5, color: '#1a1a1a', cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF8C35')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)')}
                  >
                    {faq.q}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px', borderTop: '0.5px solid rgba(0,0,0,0.08)',
            display: 'flex', gap: 8, background: '#fff',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Type a question…"
              style={{
                flex: 1, border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: 8,
                padding: '8px 12px', fontSize: 13, outline: 'none',
                fontFamily: "'DM Sans', sans-serif", background: '#f8f8f6',
              }}
            />
            <button
              onClick={() => send(input)}
              style={{
                background: '#FF8C35', border: 'none', borderRadius: 8,
                padding: '0 14px', cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
