/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
        pathname: '/product-images/**',
      },
      {
        protocol: 'https',
        hostname: '*.dummyjson.com',
      },
    ],
  },
};

module.exports = nextConfig;
