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
        // 로컬 개발 환경일 때 사용
        // destination: 'http://localhost:8000/api/:path*',
        // Render 배포 환경에서 사용
        destination: 'https://algovote-backend.onrender.com/api/:path*',
      },
    ]
  }
};

export default nextConfig;
