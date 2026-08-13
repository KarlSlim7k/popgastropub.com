/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'popgastropub.com',
      },
      {
        protocol: 'https',
        hostname: 'api.popgastropub.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/nosotros',
        destination: '/sobre-nosotros',
        permanent: true,
      },
      {
        source: '/promos',
        destination: '/promociones',
        permanent: true,
      },
      {
        source: '/orden',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/pedidos',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/admin/pedidos',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
}

export default nextConfig
