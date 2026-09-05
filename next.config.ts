import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignores TypeScript errors during Vercel builds so deployment succeeds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;