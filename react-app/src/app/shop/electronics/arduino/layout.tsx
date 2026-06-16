import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arduino Boards & Kits | Kyzer Robotics',
  description:
    'Shop Arduino boards, starter kits, shields, and accessories from Kyzer Robotics — for hobby projects, prototyping, and education across India.',
  alternates: { canonical: 'https://kyzerrobotics.com/shop/electronics/arduino' },
  robots: 'index, follow',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
