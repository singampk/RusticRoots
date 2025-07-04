/** @type {import('next').NextConfig} */
const nextConfig = {
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
  output: 'standalone',
};

module.exports = nextConfig;