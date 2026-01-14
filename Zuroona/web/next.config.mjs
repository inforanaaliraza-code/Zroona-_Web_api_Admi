/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Reduce compilation logs
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Reduce webpack stats 6z
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
        protocol: "http",
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;
