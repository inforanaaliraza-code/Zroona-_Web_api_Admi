/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  // 🚀 SPEED OPTIMIZATIONS
  
  // Reduce compilation logs
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  
  // Experimental features for faster builds
  experimental: {
    // Optimize package imports (reduces bundle size)
    optimizePackageImports: [
      'react-icons',
      'react-toastify',
      '@iconify/react',
      'chart.js',
      'react-chartjs-2',
      'react-datepicker',
    ],
    // Enable parallel compilation
    webpackBuildWorker: true,
  },
  
  // Reduce webpack stats output
  webpack: (config, { isServer }) => {
    config.stats = 'errors-only';
    
    // Optimize chunks for faster loading
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    
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
  
  // Compress output
  compress: true,
  
  // Optimize production build
  swcMinify: true,
  
  // Reduce page data
  pageExtensions: ['js', 'jsx'],
};

export default nextConfig;
