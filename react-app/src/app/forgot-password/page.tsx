'use client';
import { useEffect } from 'react';
export default function ForgotPasswordPage() {
  useEffect(() => { window.location.replace('/login'); }, []);
  return null;
}
