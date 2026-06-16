import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Drone Frames — Carbon & Glass Fiber | Kyzer Robotics',
  description:
    'Racing, quadcopter, and hexacopter drone frames in carbon fiber and glass fiber. Pick your geometry and build weight — shipped from Pune, India.',
  alternates: { canonical: 'https://kyzerrobotics.com/shop/drone-frames' },
  robots: 'index, follow',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
