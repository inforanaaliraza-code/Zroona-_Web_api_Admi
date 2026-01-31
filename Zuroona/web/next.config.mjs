/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Reduce compilation logs
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Reduc webpack stats 6z
  webpack: (config, { isServer }) => {
    config.stats = 'errors-only';

    // Suppress source map warnings for third-party CSS
    if (!isServer) {
      config.ignoreWarnings = [
        { module: /node_modules\/react-toastify/ },
        { file: /\.css\.map$/ },
      ];
    }

    return config;
  },

  // Suppress 404 warnings for source maps in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    // Increase minimum cache TTL to reduce repeated fetches
    minimumCacheTTL: 60,
    // Configure image sizes for optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Allow unoptimized images for external sources that may timeout
    unoptimized: false,
    // Configure remote patterns for external images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3434",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      // AWS S3 patterns - including regional endpoints
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.*.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3-*.amazonaws.com",
        pathname: "/**",
      },
      // Cloudinary support
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;
