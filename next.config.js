/** @type {import('next').NextConfig} */
const nextConfig = {
  // Nunca publica los "source maps" -> sin esto, cualquiera puede
  // reconstruir tu código fuente original línea por línea desde el navegador.
  productionBrowserSourceMaps: false,

  // Quita console.log / console.warn del bundle final en producción
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error'] }
      : false,
  },

  // No delata la versión/tecnología en las cabeceras HTTP
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "img-src 'self' data: https:",
              "style-src 'self' 'unsafe-inline'",
              "script-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
