/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Compression and performance
  compress: true,
  poweredByHeader: false,
  // Generate build ID for better caching
  generateBuildId: async () => {
    return new Date().getTime().toString();
  },
  // Production optimizations
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
}

module.exports = nextConfig
