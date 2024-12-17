/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/shop/:slug*',
          has: [
            {
              type: 'query',
              key: 'redirect',
              value: 'true',
            },
          ],
          destination: '/shop/:slug*',
        },
      ],
    }
  },
}

module.exports = nextConfig
