import type { Metadata } from 'next';
import LegalLayout from '../_components/LegalLayout';

export const metadata: Metadata = {
  title: 'Product Pricing — Kyzer Robotics',
  description:
    'How pricing works at Kyzer Robotics Pvt. Ltd. — product prices, custom 3D printing quotes, currency, and accepted payment methods.',
  alternates: { canonical: 'https://kyzerrobotics.com/pricing' },
  robots: 'index, follow',
};

export default function PricingPage() {
  return (
    <LegalLayout title="Product Pricing" crumb="Pricing" updated="15 June 2026">
      <p>
        This page explains how pricing works at <strong>Kyzer Robotics Pvt. Ltd.</strong> All prices on{' '}
        <a href="https://kyzerrobotics.com">kyzerrobotics.com</a> are listed in <strong>Indian Rupees (₹ INR)</strong>.
      </p>

      <h2>Ready-Made Products</h2>
      <ul>
        <li>
          Prices for in-stock drones, drone frames, electronics, components, and printer supplies are shown on each
          product in our shop. Browse the catalogue from the <a href="/">homepage</a>.
        </li>
        <li>The price displayed at checkout is the final price you pay for that item.</li>
        <li>Prices may change over time due to availability and supplier costs; the current listed price always applies.</li>
      </ul>

      <h2>Custom 3D Printing &amp; Builds</h2>
      <ul>
        <li>
          Custom 3D printing and custom drone builds are <strong>quote-based</strong>. The price depends on material,
          size, volume/weight, finish, complexity, and turnaround.
        </li>
        <li>
          Get an instant estimate using our <a href="/get-a-quote">3D quote tool</a>, or send your files and
          requirements for a tailored quote.
        </li>
        <li>The quoted amount is confirmed with you before any production begins.</li>
      </ul>

      <h2>Shipping Charges</h2>
      <p>
        Shipping charges, if any, are calculated at checkout based on weight, size, and destination. See our{' '}
        <a href="/shipping-policy">Shipping &amp; Delivery Policy</a> for details.
      </p>

      <h2>Payment Methods</h2>
      <ul>
        <li>Online payments — UPI, debit/credit cards, net banking, and wallets — are processed securely via <strong>Cashfree</strong>.</li>
        <li>Cash on Delivery (COD) may be available on eligible orders and can carry a small handling fee.</li>
        <li>We do not store your card or UPI details on our servers.</li>
      </ul>

      <h2>No Hidden Charges</h2>
      <p>
        The total shown at checkout — product price plus any applicable shipping — is what you pay. A valid invoice is
        provided for every order. For refunds and cancellations, see our <a href="/refund-policy">Refund Policy</a> and{' '}
        <a href="/cancellation">Cancellation Policy</a>.
      </p>
    </LegalLayout>
  );
}
