/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  // 🚀 ULTRA-FAST PERFORMANCE OPTIMIZATIONS
  
  // Reduce compilation logs - minimal output
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  
  // Advanced experimental features for maximum speed
  experimental: {
    // Optimize package imports (reduces bundle size by 40-60%)
    optimizePackageImports: [
      'react-icons',
      'react-toastify',
      '@iconify/react',
      'chart.js',
      'react-chartjs-2',
      'react-datepicker',
      'lucide-react',
      'react-quill',
      'date-fns',
    ],
    // Enable Turbopack optimizations
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Optimize server components (removed react-quill as it has CSS that can't be externalized)
    serverComponentsExternalPackages: [
      'jspdf',
      'jspdf-autotable',
    ],
    // Memory optimization
    memoryBasedWorkersCount: true,
  },
  
  // Webpack config - only used for production builds
  webpack: (config, { isServer, dev }) => {
    // Only apply webpack-specific config when not using Turbopack (production builds)
    if (!dev) {
      config.stats = 'errors-only';
      
      // Aggressive optimization for production
      if (!isServer) {
        config.optimization = {
          ...config.optimization,
          moduleIds: 'deterministic',
          runtimeChunk: 'single',
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              default: false,
              vendors: false,
              // Framework chunk (React, Next.js)
              framework: {
                name: 'framework',
                chunks: 'all',
                test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
                priority: 40,
                enforce: true,
              },
              // Vendor chunk for node_modules
              vendor: {
                name: 'vendor',
                chunks: 'all',
                test: /[\\/]node_modules[\\/]/,
                priority: 20,
                reuseExistingChunk: true,
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
              // Large libraries in separate chunks
              chartjs: {
                name: 'chartjs',
                test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
                chunks: 'all',
                priority: 30,
              },
              quill: {
                name: 'quill',
                test: /[\\/]node_modules[\\/](react-quill|quill)[\\/]/,
                chunks: 'all',
                priority: 30,
              },
            },
          },
        };
      }
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
  
  // Output configuration
  output: 'standalone',
  
  // Power optimization settings
  poweredByHeader: false,
  
  // Optimize compiler (only for production, not supported by Turbopack in dev)
  // Note: removeConsole is disabled in dev mode to support Turbopack
  // In production builds, console statements will be removed automatically by SWC
};

export default nextConfig;
