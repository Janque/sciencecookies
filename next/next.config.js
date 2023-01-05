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
      },
      {
        source: '/:locale/calendars',
        destination: '/en/calendarios',
        locale: false
      },
      {
        source: '/:locale/calendarios',
        destination: '/es/calendarios',
        locale: false
      }
    ]
  }
}

module.exports = nextConfig
