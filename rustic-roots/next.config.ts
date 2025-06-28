import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.therusticroots.com.au',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
