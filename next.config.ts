import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/pinewraps-23e8a.firebasestorage.app/**',
      },
      {
        protocol: 'https',
        hostname: 'pinewraps-23e8a.firebasestorage.app',
        pathname: '/**',
      },
    ],
  },
  env: {
    PORT: '3002',
  },
};

export default nextConfig;
