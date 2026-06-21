import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@noble/curves", "@noble/hashes"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
