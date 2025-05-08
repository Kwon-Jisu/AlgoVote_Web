import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.namu.wiki',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'readdy.ai',
        pathname: '/**',
      },
    ],
  },
  
  // API 요청 프록시 설정
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://algovote.onrender.com/api/:path*',
      },
    ]
  },
};

export default nextConfig;
