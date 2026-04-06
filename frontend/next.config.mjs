/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pop-perote.com',
      },
    ],
  },
}

export default nextConfig
