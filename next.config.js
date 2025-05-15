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
  // Production'da hata mesajlarını göster
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      config.optimization.minimize = false;
    }
    // Production'da hata mesajlarını göster
    if (!dev) {
      config.optimization.minimize = false;
      config.optimization.minimizer = [];
    }
    return config;
  }
}

module.exports = nextConfig 