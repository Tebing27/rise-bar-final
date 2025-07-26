import type { NextConfig } from "next";

// 1. Impor dan konfigurasikan bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// 2. Definisikan konfigurasi Next.js Anda
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

// 3. Bungkus konfigurasi Anda dengan bundle analyzer
module.exports = withBundleAnalyzer(nextConfig);

// HAPUS BARIS INI -> export default nextConfig;