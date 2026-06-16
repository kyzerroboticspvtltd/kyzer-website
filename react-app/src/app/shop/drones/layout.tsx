import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Drones — Frames & Complete Builds | Kyzer Robotics',
  description:
    'Shop drones from Kyzer Robotics — carbon-fiber frames and ready-to-fly survey, FPV, and agricultural drones, built and tested in Pune.',
  alternates: { canonical: 'https://kyzerrobotics.com/shop/drones' },
  robots: 'index, follow',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
