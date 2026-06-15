import type { Metadata } from 'next';
import LegalLayout from '../_components/LegalLayout';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy — Kyzer Robotics',
  description:
    'Kyzer Robotics Pvt. Ltd. refund, return, and cancellation policy for drones, electronics, and custom 3D printing orders.',
  alternates: { canonical: 'https://kyzerrobotics.com/refund-policy' },
  robots: 'index, follow',
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund & Cancellation" updated="11 June 2026">
      <p>
        This policy explains when and how you can cancel an order, return a product, or request a refund from{' '}
        <strong>Kyzer Robotics Pvt. Ltd.</strong> We want you to be satisfied with your purchase, and we handle every
        request fairly and promptly.
      </p>

      <h2>Order Cancellation</h2>
      <ul>
        <li>
          <strong>Ready-made products</strong> (drones in stock, electronics, components): you may cancel before the item
          is dispatched for a full refund. Once dispatched, the return policy below applies.
        </li>
        <li>
          <strong>Custom builds &amp; 3D printing orders:</strong> these are made specifically for you. They can be
          cancelled only before production begins. Once we have started printing or assembly, the order cannot be
          cancelled and is non-refundable.
        </li>
        <li>To cancel, email <a href="mailto:info@kyzerrobotics.com">info@kyzerrobotics.com</a> or WhatsApp{' '}
          <a href="https://wa.me/919049695264">+91 90496 95264</a> with your order ID as early as possible.</li>
      </ul>

      <h2>Returns &amp; Replacements</h2>
      <p>We accept returns or offer replacements in the following cases:</p>
      <ul>
        <li>The product arrived <strong>damaged or defective</strong>.</li>
        <li>You received the <strong>wrong item</strong>.</li>
      </ul>
      <p>
        To be eligible, you must notify us within <strong>48 hours of delivery</strong> with your order ID and clear
        photos/video of the issue (an unboxing video is strongly recommended for drones and electronics). The item must
        be unused and in its original packaging with all accessories.
      </p>

      <h3>Not Eligible for Return</h3>
      <ul>
        <li>Custom-made or made-to-order items (custom drones, custom 3D prints) unless they arrived defective.</li>
        <li>Items damaged due to misuse, mishandling, or normal wear and tear.</li>
        <li>Consumables (e.g. filament) once opened.</li>
        <li>Products returned after 48 hours or without original packaging.</li>
      </ul>

      <h2>Refunds</h2>
      <ul>
        <li>
          Approved refunds are processed to your <strong>original payment method</strong> within{' '}
          <strong>7–10 business days</strong> of approval. The exact credit time depends on your bank or payment
          provider.
        </li>
        <li>For prepaid orders, the full eligible amount is refunded. For COD orders, refunds are made via bank
          transfer/UPI to details you provide.</li>
        <li>Shipping charges are non-refundable unless the return is due to our error.</li>
      </ul>

      <h2>Damaged in Transit</h2>
      <p>
        If your package arrives visibly damaged, please refuse delivery if possible, or report it within 48 hours with
        photos. We will arrange a replacement or refund at no extra cost.
      </p>

      <h2>How to Request</h2>
      <p>
        Email <a href="mailto:info@kyzerrobotics.com">info@kyzerrobotics.com</a> with your order ID, reason, and
        supporting photos/video. Our team will respond within 2 business days with the next steps.
      </p>
    </LegalLayout>
  );
}
