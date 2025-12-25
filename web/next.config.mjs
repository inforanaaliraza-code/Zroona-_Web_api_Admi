/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Reduce compilation logs
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Reduce webpack stats output
  webpack: (config, { isServer }) => {
    config.stats = 'errors-only';
    return config;
  },
  images: {
    unoptimized: true,
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
