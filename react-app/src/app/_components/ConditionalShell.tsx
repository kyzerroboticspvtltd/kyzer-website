'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import ChatBot from './ChatBot';

const HIDE_SHELL = ['/coming-soon'];

export default function ConditionalShell() {
  const pathname = usePathname();
  if (HIDE_SHELL.some(p => pathname.startsWith(p))) return null;
  return (
    <>
      <Footer />
      <ChatBot />
    </>
  );
}
