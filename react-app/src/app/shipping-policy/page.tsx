import type { Metadata } from 'next';
import LegalLayout from '../_components/LegalLayout';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy — Kyzer Robotics',
  description:
    'Shipping timelines, charges, and delivery information for orders placed with Kyzer Robotics Pvt. Ltd. across India.',
  alternates: { canonical: 'https://kyzerrobotics.com/shipping-policy' },
  robots: 'index, follow',
};

export default function ShippingPolicyPage() {
  return (
    <LegalLayout title="Shipping & Delivery" updated="11 June 2026">
      <p>
        This policy describes how <strong>Kyzer Robotics Pvt. Ltd.</strong> ships and delivers orders placed on{' '}
        <a href="https://kyzerrobotics.com">kyzerrobotics.com</a>. We ship across India through reliable courier partners.
      </p>

      <h2>Processing Time</h2>
      <ul>
        <li><strong>In-stock products</strong> are typically dispatched within <strong>1–3 business days</strong> of order confirmation.</li>
        <li>
          <strong>Custom 3D printing</strong> orders are produced to the timeline shown on your quote — standard turnaround
          is around <strong>2–7 working days</strong>, with same-day/rush options where available.
        </li>
        <li><strong>Custom drone builds</strong> are assembled and tested before dispatch; estimated build time is confirmed with your quote.</li>
      </ul>

      <h2>Delivery Time</h2>
      <p>
        After dispatch, delivery usually takes <strong>3–7 business days</strong> depending on your location. Remote
        areas may take longer. Delays caused by couriers, weather, or other factors outside our control are possible.
      </p>

      <h2>Shipping Charges</h2>
      <ul>
        <li>Shipping charges (if any) are calculated at checkout based on weight, size, and destination.</li>
        <li><strong>Free delivery</strong> may be offered on eligible orders above a stated value — see current offers on our homepage.</li>
        <li>Cash on Delivery (COD) may carry a small handling fee where applicable.</li>
      </ul>

      <h2>Order Tracking</h2>
      <p>
        Once your order ships, we will share tracking details by email or WhatsApp. You can also reach us anytime at{' '}
        <a href="https://wa.me/919049695264">+91 90496 95264</a> for an update.
      </p>

      <h2>Delivery Address</h2>
      <p>
        Please ensure your shipping address and phone number are accurate and complete. We are not responsible for
        deliveries failed due to incorrect address details. Re-shipping for returned/undelivered parcels may incur
        additional charges.
      </p>

      <h2>Damaged or Lost Shipments</h2>
      <p>
        If your shipment is lost in transit or arrives damaged, please contact us within 48 hours of the expected/actual
        delivery. See our <a href="/refund-policy">Refund &amp; Cancellation Policy</a> for how we resolve such cases.
      </p>

      <h2>International Shipping</h2>
      <p>
        We currently ship within India. For international enquiries, please contact{' '}
        <a href="mailto:info@kyzerrobotics.com">info@kyzerrobotics.com</a>.
      </p>
    </LegalLayout>
  );
}
