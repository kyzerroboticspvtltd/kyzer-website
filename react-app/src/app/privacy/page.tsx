import type { Metadata } from 'next';
import LegalLayout from '../_components/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy — Kyzer Robotics',
  description:
    'How Kyzer Robotics Pvt. Ltd. collects, uses, stores, and protects your personal information when you use kyzerrobotics.com.',
  alternates: { canonical: 'https://kyzerrobotics.com/privacy' },
  robots: 'index, follow',
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="11 June 2026">
      <p>
        <strong>Kyzer Robotics Pvt. Ltd.</strong> (&quot;Kyzer Robotics&quot;, &quot;we&quot;, &quot;us&quot;, or
        &quot;our&quot;) operates the website <a href="https://kyzerrobotics.com">kyzerrobotics.com</a>. We are
        committed to protecting your privacy. This policy explains what information we collect, how we use it, and the
        rights you have over your data.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>
          <strong>Contact &amp; order details</strong> — name, email address, phone number, shipping address, and
          company name that you provide through our contact form, quote requests, or checkout.
        </li>
        <li>
          <strong>Order &amp; payment information</strong> — items purchased, order value, and payment status. Card and
          UPI details are processed directly by our payment gateway (Cashfree) and are <strong>never stored on our
          servers</strong>.
        </li>
        <li>
          <strong>Uploaded files</strong> — 3D model files (STL/STEP/OBJ, etc.) you submit for printing quotes, used
          solely to prepare your quote and fulfil your order.
        </li>
        <li>
          <strong>Usage data</strong> — basic, anonymous analytics such as page visits, to help us improve the site.
        </li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process and fulfil your orders, quotes, and enquiries.</li>
        <li>To send order confirmations, invoices, and delivery updates.</li>
        <li>To respond to your questions and provide customer support.</li>
        <li>To send product updates or offers — only if you have opted in. You can unsubscribe at any time.</li>
        <li>To detect, prevent, and address fraud or technical issues.</li>
      </ul>

      <h2>Sharing Your Information</h2>
      <p>
        We do <strong>not</strong> sell or rent your personal data. We share information only with trusted service
        providers needed to run our business:
      </p>
      <ul>
        <li><strong>Cashfree</strong> — payment processing.</li>
        <li><strong>Courier &amp; logistics partners</strong> — to deliver your order.</li>
        <li><strong>Email &amp; database providers</strong> (e.g. Google, Supabase) — to send notifications and store order records securely.</li>
      </ul>
      <p>We may also disclose information where required by law or to protect our legal rights.</p>

      <h2>Data Retention</h2>
      <p>
        We keep order and invoice records for as long as required to meet legal, accounting, and tax obligations under
        Indian law. Uploaded model files are retained only as long as needed to fulfil your order and may be deleted on
        request.
      </p>

      <h2>Cookies &amp; Local Storage</h2>
      <p>
        Our site uses browser local storage to remember your cart and preferences. We use only essential and basic
        analytics cookies. You can clear these at any time through your browser settings.
      </p>

      <h2>Data Security</h2>
      <p>
        We use reasonable technical and organisational measures to protect your data, including encrypted connections
        (HTTPS) and access controls. However, no method of transmission over the internet is 100% secure.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data. To exercise any of these rights,
        email us at <a href="mailto:info@kyzerrobotics.com">info@kyzerrobotics.com</a>.
      </p>

      <h2>Children&apos;s Privacy</h2>
      <p>Our services are not directed at children under 18, and we do not knowingly collect their data.</p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. The &quot;Last updated&quot; date above reflects the latest
        revision. Continued use of the site after changes constitutes acceptance of the updated policy.
      </p>
    </LegalLayout>
  );
}
