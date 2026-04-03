import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '3000-firebase-my-ecommerce-1774638373297.cluster-64pjnskmlbaxowh5lzq6i7v4ra.cloudworkstations.dev'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // السطرين دول عشان نسمح بصور أمازون
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;