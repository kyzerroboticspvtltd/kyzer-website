import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Electronics — Arduino, Sensors & Modules | Kyzer Robotics',
  description:
    'Buy Arduino boards, sensors, modules, and robotics electronics from Kyzer Robotics. Quality components for makers, students, and engineers in India.',
  alternates: { canonical: 'https://kyzerrobotics.com/shop/electronics' },
  robots: 'index, follow',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
