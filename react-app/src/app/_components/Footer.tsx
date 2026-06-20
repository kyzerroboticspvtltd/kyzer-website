export default function Footer() {
  return (
    <footer style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="footer-main">
        <div className="footer-brand">
          <a href="/" className="footer-logo-row">
            <img src="/logo.png" alt="Kyzer Robotics" className="footer-logo" />
            <span className="footer-wordmark">Kyzer<span>Robotics</span></span>
          </a>
          <p className="footer-tag">Custom drones, electronics &amp; precision 3D printing — designed and built in Pune, India.</p>
          <div className="footer-contact">
            <div className="fc-row"><span className="fc-ic">📍</span><a href="https://maps.google.com/?q=Kyzer+Robotics+Ambegaon+Pathar+Pune" target="_blank" rel="noopener">Ambegaon Pathar, Pune, Maharashtra, India</a></div>
            <div className="fc-row"><span className="fc-ic">✉️</span><a href="mailto:info@kyzerrobotics.com">info@kyzerrobotics.com</a></div>
            <div className="fc-row"><span className="fc-ic">📞</span><a href="tel:+919049695264">+91 90496 95264</a></div>
            <div className="fc-row"><span className="fc-ic">🕑</span><span>Mon–Sat · 10:00 AM – 7:00 PM IST</span></div>
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <a href="/shop/drones">Drones</a>
          <a href="/shop/complete-drones">Complete Drones</a>
          <a href="/shop/drone-frames">Drone Frames</a>
          <a href="/shop/electronics">Electronics</a>
          <a href="/shop/3d-printing">3D Printing</a>
          <a href="/shop/printers-supplies">Printers &amp; Supplies</a>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
          <a href="/pricing">Product Pricing</a>
          <a href="/get-a-quote">Get a 3D Quote</a>
          <a href="/studio">Kyzer Studio</a>
        </div>

        <div className="footer-col">
          <h4>Policies</h4>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms &amp; Conditions</a>
          <a href="/refund-policy">Refund Policy</a>
          <a href="/cancellation">Cancellation Policy</a>
          <a href="/shipping-policy">Shipping &amp; Delivery</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">© 2026 Kyzer Robotics Pvt. Ltd. — All Rights Reserved</p>
        <div className="footer-social">
          <a href="https://www.instagram.com/kyzer.robotics" target="_blank" rel="noopener" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://wa.me/919049695264" target="_blank" rel="noopener" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          </a>
          <a href="https://g.page/r/CTEFLjTGuzKKEAI/review" target="_blank" rel="noopener" aria-label="Google Reviews">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.401 8.169L12 18.896l-7.335 3.867 1.401-8.169L.132 9.21l8.2-1.192z"/></svg>
          </a>
        </div>
        <div className="footer-pay">
          <span className="pay-chip">UPI</span>
          <span className="pay-chip">VISA</span>
          <span className="pay-chip">Mastercard</span>
          <span className="pay-chip">RuPay</span>
          <span className="pay-chip pay-rzp">🔒 Razorpay</span>
        </div>
      </div>
    </footer>
  );
}
