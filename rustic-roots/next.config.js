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
      {
        protocol: 'https',
        hostname: 's3.ap-southeast-2.amazonaws.com',
        port: '',
        pathname: '/files.therusticroots.com.au/images/**',
      },
    ],
  },
  output: 'standalone',
};

module.exports = nextConfig;