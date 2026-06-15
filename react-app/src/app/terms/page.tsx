import type { Metadata } from 'next';
import LegalLayout from '../_components/LegalLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Kyzer Robotics',
  description:
    'The terms and conditions governing your use of kyzerrobotics.com and any purchase of products or services from Kyzer Robotics Pvt. Ltd.',
  alternates: { canonical: 'https://kyzerrobotics.com/terms' },
  robots: 'index, follow',
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" updated="11 June 2026">
      <p>
        These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of <a href="https://kyzerrobotics.com">kyzerrobotics.com</a>{' '}
        and the purchase of any products or services from <strong>Kyzer Robotics Pvt. Ltd.</strong> By using our website
        or placing an order, you agree to these Terms.
      </p>

      <h2>1. About Us</h2>
      <p>
        Kyzer Robotics Pvt. Ltd. is a company based in Pune, Maharashtra, India, offering drones, drone components,
        electronics, 3D printing, and custom prototyping services.
      </p>

      <h2>2. Products &amp; Services</h2>
      <ul>
        <li>We sell ready-made products as well as custom-built drones and 3D-printed parts made to order.</li>
        <li>
          Product images, specifications, and descriptions are provided for guidance. Custom and hand-assembled items may
          vary slightly from images shown.
        </li>
        <li>All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes (GST) unless stated otherwise.</li>
        <li>We reserve the right to correct pricing errors and to modify or discontinue any product without notice.</li>
      </ul>

      <h2>3. Orders &amp; Quotes</h2>
      <ul>
        <li>Placing an order is an offer to purchase. We may accept or decline any order at our discretion.</li>
        <li>
          For custom 3D printing and drone builds, work begins only after the quote is confirmed and (where applicable)
          payment is received. Estimated quotes are subject to final confirmation after we review your files.
        </li>
        <li>An order confirmation and invoice will be emailed to you once your order is accepted.</li>
      </ul>

      <h2>4. Pricing &amp; Payment</h2>
      <ul>
        <li>Payments are processed securely through <strong>Razorpay</strong>. We also offer Cash on Delivery (COD) where available.</li>
        <li>We do not store your card, UPI, or banking details.</li>
        <li>Your order is confirmed only after successful payment (or COD confirmation).</li>
      </ul>

      <h2>5. Shipping &amp; Delivery</h2>
      <p>
        Delivery timelines and charges are described in our{' '}
        <a href="/shipping-policy">Shipping &amp; Delivery Policy</a>.
      </p>

      <h2>6. Cancellations &amp; Refunds</h2>
      <p>
        Cancellations, returns, and refunds are governed by our{' '}
        <a href="/refund-policy">Refund &amp; Cancellation Policy</a>. Please note that custom-made and made-to-order
        items are generally non-refundable once production has started.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        All content on this website — including text, graphics, logos, and the Kyzer Robotics name — is our property and
        protected by applicable laws. You retain ownership of any design files you upload; by uploading, you grant us a
        limited licence to use them solely to fulfil your order.
      </p>

      <h2>8. Acceptable Use</h2>
      <p>
        You agree not to misuse the website, attempt unauthorised access, or submit files that infringe third-party
        rights or are unlawful to produce.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Kyzer Robotics shall not be liable for any indirect, incidental, or
        consequential damages arising from the use of our products, services, or website. Our total liability for any
        claim shall not exceed the amount paid for the relevant order.
      </p>

      <h2>10. Warranty</h2>
      <p>
        Manufacturer warranties (where applicable) apply to specific products as stated at the time of sale. Custom and
        consumable items may carry limited or no warranty.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of
        the courts of Pune, Maharashtra.
      </p>

      <h2>12. Contact</h2>
      <p>
        For any questions about these Terms, contact us at{' '}
        <a href="mailto:info@kyzerrobotics.com">info@kyzerrobotics.com</a>.
      </p>
    </LegalLayout>
  );
}
