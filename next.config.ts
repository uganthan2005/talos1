import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip TypeScript checking during build for faster deployment
  typescript: {
    ignoreBuildErrors: true,
  },

  // React Compiler disabled - causes Turbopack issues
  // reactCompiler: true,

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // Use modern image formats
    formats: ['image/avif', 'image/webp'],
    // Reduce image sizes
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['motion/react', 'lucide-react', 'gsap'],
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable compression
  compress: true,

  // Power hints for better resource loading
  poweredByHeader: false,
};

export default nextConfig;
