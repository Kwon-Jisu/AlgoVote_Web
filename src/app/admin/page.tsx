import React from 'react';
import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/data-log">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-divider hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <i className="ri-database-2-line text-primary text-xl"></i>
            </div>
            <h2 className="text-xl font-semibold mb-2">데이터 로그 관리</h2>
            <p className="text-text-secondary">
              데이터 수집 로그를 추가하고 관리합니다.
            </p>
          </div>
        </Link>
        
        <Link href="/admin/candidates">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-divider hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <i className="ri-user-settings-line text-primary text-xl"></i>
            </div>
            <h2 className="text-xl font-semibold mb-2">후보자 관리</h2>
            <p className="text-text-secondary">
              후보자 정보와 공약을 업데이트합니다.
            </p>
          </div>
        </Link>
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">빠른 링크</h2>
        <ul className="bg-white p-6 rounded-lg shadow-sm border border-divider space-y-2">
          <li>
            <Link href="/data-log" className="text-primary hover:underline flex items-center">
              <i className="ri-external-link-line mr-2"></i>
              <span>데이터 로그 페이지 보기</span>
            </Link>
          </li>
          <li>
            <Link href="/" className="text-primary hover:underline flex items-center">
              <i className="ri-home-line mr-2"></i>
              <span>메인 페이지로 이동</span>
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="mt-8 text-center text-text-secondary text-sm">
        <p>이 페이지는 관리자 전용입니다. 유출되지 않도록 주의하세요.</p>
      </div>
    </div>
  );
} 