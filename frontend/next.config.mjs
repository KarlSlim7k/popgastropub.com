/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'popgastropub.com',
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
