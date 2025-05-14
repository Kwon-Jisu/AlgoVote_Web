import React from 'react';
import type { Metadata } from 'next';
import AdminAuth from '@/components/admin/admin-auth';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '관리자 페이지 | 알고투표',
  description: '알고투표 관리자 대시보드',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuth>
      <div className="min-h-screen bg-background">
        <header className="bg-black text-white p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">알고투표 관리자</h1>
              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <Link href="/admin/data-log" className="hover:text-primary transition-colors">
                      데이터 로그
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/candidates" className="hover:text-primary transition-colors">
                      후보자 관리
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-primary transition-colors">
                      사이트로 이동
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </AdminAuth>
  );
} 