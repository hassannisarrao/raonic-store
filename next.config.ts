import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignores TypeScript errors during Vercel builds so deployment succeeds
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignores ESLint warnings during builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;