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
    ];
  },
}

export default nextConfig
