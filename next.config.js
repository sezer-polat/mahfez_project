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
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
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
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
      {
        source: '/admin/turlar',
        destination: '/admin/tours',
        permanent: true,
      },
      {
        source: '/admin/kategoriler',
        destination: '/admin/categories',
        permanent: true,
      },
      {
        source: '/admin/rezervasyonlar',
        destination: '/admin/bookings',
        permanent: true,
      },
      {
        source: '/admin/kullanicilar',
        destination: '/admin/users',
        permanent: true,
      },
      {
        source: '/admin/raporlar',
        destination: '/admin/reports',
        permanent: true,
      },
      {
        source: '/admin/ayarlar',
        destination: '/admin/settings',
        permanent: true,
      },
      {
        source: '/admin/mesajlar',
        destination: '/admin/messages',
        permanent: true,
      },
      {
        source: '/admin/yeni-tur',
        destination: '/admin/tours/new',
        permanent: true,
      },
      {
        source: '/admin/tur-duzenle/:id',
        destination: '/admin/tours/:id',
        permanent: true,
      },
      {
        source: '/admin/kategori-duzenle/:id',
        destination: '/admin/categories/:id',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig 