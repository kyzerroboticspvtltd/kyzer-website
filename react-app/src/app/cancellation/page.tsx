import type { Metadata } from 'next';
import LegalLayout from '../_components/LegalLayout';

export const metadata: Metadata = {
  title: 'Cancellation Policy — Kyzer Robotics',
  description:
    'How to cancel an order with Kyzer Robotics Pvt. Ltd. — cancellation windows for ready-made products, custom builds, and 3D printing orders.',
  alternates: { canonical: 'https://kyzerrobotics.com/cancellation' },
  robots: 'index, follow',
};

export default function CancellationPage() {
  return (
    <LegalLayout title="Cancellation Policy" updated="15 June 2026">
      <p>
        This policy explains when and how you can cancel an order placed with{' '}
        <strong>Kyzer Robotics Pvt. Ltd.</strong> on <a href="https://kyzerrobotics.com">kyzerrobotics.com</a>. For
        returns and refunds after delivery, please see our <a href="/refund-policy">Refund Policy</a>.
      </p>

      <h2>Ready-Made Products</h2>
      <ul>
        <li>
          Orders for in-stock products (drones, electronics, components, supplies) can be cancelled{' '}
          <strong>any time before dispatch</strong> for a full refund.
        </li>
        <li>Once an order has been dispatched, it cannot be cancelled — the <a href="/refund-policy">Refund Policy</a> applies instead.</li>
      </ul>

      <h2>Custom Builds &amp; 3D Printing</h2>
      <ul>
        <li>
          Custom drone builds and custom 3D printing orders are made specifically for you. They can be cancelled{' '}
          <strong>only before production begins</strong>.
        </li>
        <li>
          Once printing, sourcing, or assembly has started, the order <strong>cannot be cancelled</strong> and is
          non-refundable, as work and materials are already committed.
        </li>
      </ul>

      <h2>How to Cancel</h2>
      <p>To cancel an order, contact us as early as possible with your order ID:</p>
      <ul>
        <li>Email: <a href="mailto:info@kyzerrobotics.com">info@kyzerrobotics.com</a></li>
        <li>WhatsApp / Phone: <a href="https://wa.me/919049695264">+91 90496 95264</a></li>
      </ul>
      <p>We will confirm your cancellation and, where eligible, initiate any refund due.</p>

      <h2>Refunds on Cancellation</h2>
      <p>
        Approved cancellation refunds are processed to your original payment method, typically within{' '}
        <strong>7–10 business days</strong> of confirmation. Full details are in our{' '}
        <a href="/refund-policy">Refund Policy</a>.
      </p>

      <h2>Cancellations by Kyzer Robotics</h2>
      <p>
        We may cancel an order if an item is out of stock, a pricing error occurs, or the order cannot be fulfilled. In
        such cases you will be notified and refunded in full for any amount already paid.
      </p>
    </LegalLayout>
  );
}
