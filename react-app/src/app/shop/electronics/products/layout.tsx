import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Electronics Products | Kyzer Robotics',
  description:
    'Browse robotics and electronics products from Kyzer Robotics — boards, sensors, modules, and components for your next build.',
  alternates: { canonical: 'https://kyzerrobotics.com/shop/electronics/products' },
  robots: 'index, follow',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
