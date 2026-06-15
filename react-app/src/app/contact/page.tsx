import type { Metadata } from 'next';
import LegalLayout from '../_components/LegalLayout';

export const metadata: Metadata = {
  title: 'Contact Us — Kyzer Robotics',
  description:
    'Contact Kyzer Robotics Pvt. Ltd. — email, phone, WhatsApp, and address in Pune, Maharashtra, India. We reply within 24 hours.',
  alternates: { canonical: 'https://kyzerrobotics.com/contact' },
  robots: 'index, follow',
};

export default function ContactPage() {
  return (
    <LegalLayout title="Contact Us" crumb="Contact">
      <p>
        Have a project in mind? Need a quote for a custom drone or prototype? Get in touch and we&apos;ll get back to
        you within 24 hours.
      </p>

      <h2>Reach Us</h2>
      <ul>
        <li>
          <strong>Email:</strong> <a href="mailto:info@kyzerrobotics.com">info@kyzerrobotics.com</a>
        </li>
        <li>
          <strong>Phone:</strong> <a href="tel:+919049695264">+91 90496 95264</a>
        </li>
        <li>
          <strong>WhatsApp:</strong> <a href="https://wa.me/919049695264">+91 90496 95264</a>
        </li>
        <li>
          <strong>Instagram:</strong>{' '}
          <a href="https://www.instagram.com/kyzer.robotics" target="_blank" rel="noopener">@kyzer.robotics</a>
        </li>
      </ul>

      <h2>Registered Address</h2>
      <p>
        <strong>Kyzer Robotics Pvt. Ltd.</strong>
        <br />
        Ambegaon Pathar, Pune, Maharashtra, India
        <br />
        <a href="https://maps.google.com/?q=Kyzer+Robotics+Ambegaon+Pathar+Pune" target="_blank" rel="noopener">
          View on Google Maps
        </a>
      </p>

      <h2>Business Hours</h2>
      <p>Monday – Saturday, 10:00 AM – 7:00 PM IST. We respond to email and WhatsApp messages within one business day.</p>

      <h2>Send a Message</h2>
      <p>
        You can also use the contact form on our <a href="/#contact">homepage</a> to tell us about your project, request
        a quote, or ask about a product. For pricing details, see our <a href="/pricing">Pricing page</a>.
      </p>
    </LegalLayout>
  );
}
