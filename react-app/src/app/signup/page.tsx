'use client';
import { useEffect } from 'react';
export default function SignupPage() {
  useEffect(() => { window.location.replace('/login'); }, []);
  return null;
}
