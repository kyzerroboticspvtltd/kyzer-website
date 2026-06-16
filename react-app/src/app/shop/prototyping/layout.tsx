import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rapid Prototyping Service in Pune | Kyzer Robotics',
  description:
    'From concept and CAD to fabrication — rapid prototyping for startups, colleges, and industry. Engineered and delivered by Kyzer Robotics, Pune.',
  alternates: { canonical: 'https://kyzerrobotics.com/shop/prototyping' },
  robots: 'index, follow',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
