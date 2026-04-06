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
}

export default nextConfig
