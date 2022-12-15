/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    localeDetection: false
  },
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/:locale/drafts',
        destination: '/en/borradores',
        locale: false
      },
      {
        source: '/:locale/borradores',
        destination: '/es/borradores',
        locale: false
      }
    ]
  }
}

module.exports = nextConfig
