import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get a Quote — Custom Drones, 3D Printing & Prototyping | Kyzer Robotics',
  description:
    'Request a free quote for custom drones, 3D printing, or rapid prototyping. Tell us about your project and our Pune team will respond within 24 hours.',
  alternates: { canonical: 'https://kyzerrobotics.com/get-a-quote' },
  robots: 'index, follow',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
