'use client';
import { useEffect } from 'react';
export default function ResetPasswordPage() {
  useEffect(() => { window.location.replace('/login'); }, []);
  return null;
}
