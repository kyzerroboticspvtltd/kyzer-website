import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: own origin + inline scripts (admin panel, shop) + Razorpay checkout + SheetJS + jsPDF + Three.js
      "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://cdn.sheetjs.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
      // Styles: own origin + inline styles + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: own origin + Google Fonts static assets
      "font-src 'self' https://fonts.gstatic.com",
      // Images: own origin + data URIs + blob URLs + Supabase storage
      "img-src 'self' data: blob: https://*.supabase.co",
      // XHR/fetch: own origin + Supabase REST/realtime + Razorpay API
      "connect-src 'self' https://*.supabase.co https://api.razorpay.com",
      // Frames: Razorpay payment modal + Instagram embeds
      "frame-src https://checkout.razorpay.com https://www.instagram.com",
      // Disallow plugins and mixed content
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ['nodemailer', 'razorpay'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  // Canonicalise to the apex domain so cookie consent (stored in localStorage,
  // which is per-origin) and SEO stay consistent. Without this, www and the
  // apex are separate origins and the cookie banner reappears for visitors who
  // arrive via a different host than the one they accepted on.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.kyzerrobotics.com' }],
        destination: 'https://kyzerrobotics.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
