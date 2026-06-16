import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Custom 3D Printing | Kyzer Robotics',
  description:
    'Order custom 3D-printed parts online. Choose material, quality, infill, and colour, upload your file, and get it delivered — Kyzer Robotics, Pune.',
  alternates: { canonical: 'https://kyzerrobotics.com/shop/printing' },
  robots: 'index, follow',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
