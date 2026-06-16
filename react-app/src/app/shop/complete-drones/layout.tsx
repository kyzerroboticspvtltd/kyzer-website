import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complete Drones — Survey, FPV & Agricultural | Kyzer Robotics',
  description:
    'Ready-to-fly survey, FPV, and agricultural drones — fully assembled and tested before shipping. Custom builds available from Kyzer Robotics, Pune.',
  alternates: { canonical: 'https://kyzerrobotics.com/shop/complete-drones' },
  robots: 'index, follow',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
