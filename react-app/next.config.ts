import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['nodemailer', 'razorpay'],
};

export default nextConfig;
