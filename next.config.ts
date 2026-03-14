import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This will allow the build to continue even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This will allow the build to continue even if there are TypeScript errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;