import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true, // <-- disables ESLint during build
  },
  typescript: {
    ignoreBuildErrors: true, // <-- Add this line
  },
};

export default nextConfig;