import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Printing Service in Pune | Kyzer Robotics',
  description:
    'Custom FDM 3D printing in PLA, ABS, PETG, TPU, and Nylon with fast turnaround. Upload your model for an instant quote — Kyzer Robotics, Pune.',
  alternates: { canonical: 'https://kyzerrobotics.com/shop/3d-printing' },
  robots: 'index, follow',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
