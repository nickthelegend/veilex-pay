import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@noble/curves", "@noble/hashes"],
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    // Stub React Native / non-browser transitive deps pulled in by @metamask/sdk
    // (via RainbowKit) and WalletConnect.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
      "@farcaster/mini-app-solana": false,
      // Optional Solana code paths inside Coinbase/Base account SDK (pulled in by
      // RainbowKit's Coinbase connector). Unused on our EVM-only flow → stub out.
      "@solana/kit": false,
      "@solana-program/system": false,
      "@solana-program/token": false,
    };
    config.externals = [...(config.externals || []), "pino-pretty", "lokijs", "encoding"];
    return config;
  },
};

export default nextConfig;
