import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: own origin + inline scripts (admin panel, shop) + Razorpay checkout + SheetJS + jsPDF + Three.js
      "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://cdn.sheetjs.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://apis.google.com https://www.gstatic.com",
      // Styles: own origin + inline styles + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com",
      // Fonts: own origin + Google Fonts static assets + data URIs (Firebase SDK inlines fonts)
      "font-src 'self' https://fonts.gstatic.com data:",
      // Images: own origin + data URIs + blob URLs + Supabase storage + Google profile pics
      "img-src 'self' data: blob: https://*.supabase.co https://*.googleusercontent.com https://www.gstatic.com https://images.unsplash.com",
      // XHR/fetch: own origin + Supabase + Razorpay + Firebase Auth + Google APIs
      "connect-src 'self' https://*.supabase.co https://api.razorpay.com https://*.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com",
      // Frames: Razorpay + Instagram + Google sign-in popup
      "frame-src https://checkout.razorpay.com https://www.instagram.com https://kyzer-website.firebaseapp.com https://accounts.google.com",
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
  serverExternalPackages: ['razorpay', 'nodemailer'],
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
