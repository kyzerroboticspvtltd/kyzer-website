import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['nodemailer', 'razorpay'],
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
