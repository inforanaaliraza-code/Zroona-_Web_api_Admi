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
    ],
  },
};

export default nextConfig;
