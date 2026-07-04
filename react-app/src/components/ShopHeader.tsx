'use client';

import { useState, useEffect } from 'react';

interface ShopHeaderProps {
  cartCount?: number;
  cartSubtotal?: number;
}

export default function ShopHeader({ cartCount = 0, cartSubtotal = 0 }: ShopHeaderProps) {
  const [userName, setUserName] = useState('');
  const [count, setCount] = useState(cartCount);
  const [subtotal, setSubtotal] = useState(cartSubtotal);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kyzer_current_customer');
      if (raw) {
        const c = JSON.parse(raw);
        setUserName(c.name || '');
      }
      const cartRaw = localStorage.getItem('kyzer_cart');
      if (cartRaw) {
        const cart = JSON.parse(cartRaw);
        const totalQty = cart.reduce((s: number, i: { qty: number }) => s + (i.qty || 1), 0);
        const totalPrice = cart.reduce((s: number, i: { price: string | number; qty: number }) => {
          const p = parseFloat(String(i.price).replace(/[^0-9.]/g, '')) || 0;
          return s + p * (i.qty || 1);
        }, 0);
        setCount(totalQty);
        setSubtotal(totalPrice);
      }
    } catch { /* ignore */ }
  }, []);

  return (
    <>
      <style>{`
        .sh-wrap { font-family: 'DM Sans', sans-serif; }

        /* Top bar */
        .sh-topbar {
          background: #1a1a2e;
          padding: 8px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: #bbb;
        }
        .sh-topbar-left { display: flex; align-items: center; gap: 20px; }
        .sh-topbar-left a { color: #bbb; text-decoration: none; display: flex; align-items: center; gap: 6px; }
        .sh-topbar-left a:hover { color: #FF8C35; }
        .sh-topbar-right { display: flex; align-items: center; gap: 16px; }
        .sh-welcome { color: #e8e8e8; font-weight: 500; }
        .sh-social { display: flex; gap: 10px; }
        .sh-social a { color: #888; font-size: 15px; text-decoration: none; transition: color 0.2s; }
        .sh-social a:hover { color: #FF8C35; }

        /* Main nav */
        .sh-main {
          background: #fff;
          border-bottom: 1px solid #e8e8e8;
          padding: 0 32px;
          height: 72px;
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .sh-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          color: #FF8C35;
          text-decoration: none;
          letter-spacing: 0.03em;
          flex-shrink: 0;
        }
        .sh-logo span { font-size: 10px; font-weight: 600; letter-spacing: 0.18em; color: #111; vertical-align: middle; margin-left: 4px; }

        /* Search */
        .sh-search {
          flex: 1;
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          max-width: 520px;
        }
        .sh-search input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 10px 16px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111;
          outline: none;
        }
        .sh-search input::placeholder { color: #aaa; }
        .sh-search button {
          background: #FF8C35;
          color: #fff;
          border: none;
          padding: 0 20px;
          height: 42px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }
        .sh-search button:hover { background: #e07020; }

        /* Right icons */
        .sh-icons { display: flex; align-items: center; gap: 6px; margin-left: auto; }
        .sh-icon-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          padding: 8px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: #333;
          cursor: pointer;
          border: none;
          background: none;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          transition: background 0.15s;
        }
        .sh-icon-btn:hover { background: #f5f5f5; }
        .sh-icon-btn .icon { font-size: 20px; line-height: 1; }
        .sh-icon-btn .label { font-size: 11px; color: #888; }

        /* Cart icon */
        .sh-cart-wrap { position: relative; }
        .sh-cart-badge {
          position: absolute;
          top: 4px; right: 8px;
          background: #FF8C35;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          width: 18px; height: 18px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #fff;
        }
        .sh-cart-subtotal {
          font-size: 11px;
          font-weight: 700;
          color: #FF8C35;
          margin-top: 1px;
        }

        /* Category nav */
        .sh-catnav {
          background: #fff;
          border-bottom: 1px solid #e8e8e8;
          padding: 0 32px;
          height: 44px;
          display: flex;
          align-items: center;
          gap: 0;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .sh-catnav::-webkit-scrollbar { display: none; }
        .sh-navlink {
          padding: 0 16px;
          height: 44px;
          display: flex;
          align-items: center;
          font-size: 13.5px;
          font-weight: 500;
          color: #333;
          text-decoration: none;
          white-space: nowrap;
          border-bottom: 2px solid transparent;
          transition: color 0.2s, border-color 0.2s;
        }
        .sh-navlink:hover { color: #FF8C35; border-bottom-color: #FF8C35; }
        .sh-navlink.active { color: #FF8C35; border-bottom-color: #FF8C35; font-weight: 600; }

        @media (max-width: 768px) {
          .sh-topbar { display: none; }
          .sh-main { padding: 0 16px; gap: 12px; }
          .sh-search { max-width: none; }
          .sh-catnav { padding: 0 16px; }
          .sh-icon-btn .label { display: none; }
        }
      `}</style>

      <div className="sh-wrap">
        {/* Top bar */}
        <div className="sh-topbar">
          <div className="sh-topbar-left">
            <a href="tel:+919049695264">📞 +91 90496 95264</a>
          </div>
          <div className="sh-topbar-right">
            {userName && <span className="sh-welcome">Welcome {userName}</span>}
            <div className="sh-social">
              <a href="https://www.instagram.com/kyzerrobotics" target="_blank" rel="noreferrer" title="Instagram">📸</a>
              <a href="https://wa.me/919049695264" target="_blank" rel="noreferrer" title="WhatsApp">💬</a>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="sh-main">
          <a href="/" className="sh-logo">KYZER <span>ROBOTICS</span></a>

          <div className="sh-search">
            <input
              type="text"
              placeholder="Search products, parts, kits..."
              onKeyDown={e => { if (e.key === 'Enter') window.location.href = '/shop?q=' + encodeURIComponent((e.target as HTMLInputElement).value); }}
            />
            <button onClick={() => {
              const q = (document.querySelector('.sh-search input') as HTMLInputElement)?.value || '';
              window.location.href = '/shop' + (q ? '?q=' + encodeURIComponent(q) : '');
            }}>Search</button>
          </div>

          <div className="sh-icons">
            <a href="/orders" className="sh-icon-btn">
              <span className="icon">📦</span>
              <span className="label">Orders</span>
            </a>
            <a href={userName ? '/profile' : '/login'} className="sh-icon-btn">
              <span className="icon">👤</span>
              <span className="label">{userName ? 'Account' : 'Login'}</span>
            </a>
            <a href="/checkout" className="sh-icon-btn sh-cart-wrap">
              <span className="icon">🛒</span>
              {count > 0 && <span className="sh-cart-badge">{count}</span>}
              <span className="label">Cart</span>
              {subtotal > 0 && <div className="sh-cart-subtotal">₹{subtotal.toLocaleString('en-IN')}</div>}
            </a>
          </div>
        </div>

        {/* Category nav */}
        <div className="sh-catnav">
          <a href="/" className="sh-navlink">Home</a>
          <a href="/shop" className="sh-navlink">Shop</a>
          <a href="/#3d-print" className="sh-navlink">3D Printing</a>
          <a href="/checkout" className="sh-navlink active">Cart</a>
          <a href="/#contact" className="sh-navlink">Contact</a>
        </div>
      </div>
    </>
  );
}
