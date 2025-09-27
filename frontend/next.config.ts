import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  images:{
     remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com', // все поддомены unsplash
      },
      {
        protocol: 'https',
        hostname: '**', // разрешить все домены (не рекомендуется для продакшена)
      }
    ],
  }
};

export default nextConfig;
