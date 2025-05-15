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
  serverRuntimeConfig: {
    maxHeaderSize: 16384, // 16KB
  },
  // Geliştirme modunda hata mesajlarını göster
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      config.optimization.minimize = false;
    }
    return config;
  }
}

module.exports = nextConfig 