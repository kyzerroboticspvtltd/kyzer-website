import type { Metadata } from 'next';
import LegalLayout from '../_components/LegalLayout';

export const metadata: Metadata = {
  title: 'About Us — Kyzer Robotics',
  description:
    'Kyzer Robotics Pvt. Ltd. is a Pune-based technology company building custom drones, electronics, and precision 3D-printed parts for makers, startups, and industry.',
  alternates: { canonical: 'https://kyzerrobotics.com/about' },
  robots: 'index, follow',
};

export default function AboutPage() {
  return (
    <LegalLayout title="About Us" crumb="Company">
      <p>
        <strong>Kyzer Robotics Pvt. Ltd.</strong> is a Pune-based technology company founded by engineers passionate
        about drones and advanced manufacturing. We design, build, and deliver custom robotic solutions — from FPV
        racing drones to agricultural survey systems and precision 3D-printed parts.
      </p>
      <p>
        Whether you&apos;re a startup needing a rapid prototype, a college team building a competition UAV, or an
        industrial client looking for automation, we bring engineering precision and maker enthusiasm to every project.
      </p>

      <h2>What We Do</h2>
      <ul>
        <li><strong>Custom &amp; ready-made drones</strong> — FPV, racing, agricultural, and survey UAVs.</li>
        <li><strong>Drone frames, electronics &amp; components</strong> — flight controllers, motors, Arduino kits, and more.</li>
        <li><strong>3D printing</strong> — FDM in PLA, ABS, PETG, TPU, Nylon, and carbon-fibre composites.</li>
        <li><strong>Rapid prototyping &amp; product development</strong> — from idea to working prototype.</li>
      </ul>

      <h2>Why Kyzer Robotics</h2>
      <ul>
        <li><strong>Based in Pune, Maharashtra</strong> — where we design and manufacture in-house.</li>
        <li><strong>~48-hour average turnaround</strong> on standard 3D print orders.</li>
        <li><strong>100% custom builds</strong> — engineered to your exact specification.</li>
        <li><strong>Maker-first support</strong> over WhatsApp, email, and phone.</li>
      </ul>

      <h2>Get in Touch</h2>
      <p>
        Have a project in mind? Visit our <a href="/contact">Contact page</a>, explore <a href="/pricing">pricing</a>,
        or browse the shop from our <a href="/">homepage</a>. You can also email{' '}
        <a href="mailto:info@kyzerrobotics.com">info@kyzerrobotics.com</a> or WhatsApp{' '}
        <a href="https://wa.me/919049695264">+91 90496 95264</a>.
      </p>
    </LegalLayout>
  );
}
