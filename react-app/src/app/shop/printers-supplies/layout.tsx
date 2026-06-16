import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Printers & Supplies | Kyzer Robotics',
  description:
    'Shop 3D printers, filament, and printing supplies from Kyzer Robotics — everything you need to start or scale your 3D printing in India.',
  alternates: { canonical: 'https://kyzerrobotics.com/shop/printers-supplies' },
  robots: 'index, follow',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
