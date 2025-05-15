/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['readdy.ai'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'readdy.ai',
        pathname: '/api/search-image/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // Increase the maximum header size
  serverRuntimeConfig: {
    maxHeaderSize: 16384, // 16KB
  },
  experimental: {
    serverActions: true,
  },
  env: {
    NODE_ENV: process.env.NODE_ENV,
  },
  // Geliştirme modunda hata mesajlarını göster
  onError: (err) => {
    console.error('Next.js error:', err);
  },
}

module.exports = nextConfig 