"use client";

import React from 'react';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1E1E1E]">관리자 대시보드</h1>
        <p className="mt-2 text-[#6B7280]">
          알고투표 서비스 관리를 위한 대시보드입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">대화 내역</h2>
          <p className="text-[#6B7280] mb-4">
            사용자와 챗봇의 대화 내역을 조회하고 분석할 수 있습니다.
          </p>
          <Link
            href="/admin/chat-history"
            className="inline-block bg-[#3449FF] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
          >
            대화 내역 보기
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">통계</h2>
          <p className="text-[#6B7280] mb-4">
            서비스 사용 통계 및 인기 질문 등을 확인할 수 있습니다.
          </p>
          <Link
            href="/admin/statistics"
            className="inline-block bg-[#3449FF] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
          >
            통계 보기
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">출처 로그 관리</h2>
          <p className="text-[#6B7280] mb-4">
            출처 업데이트 내역을 기록하고 관리할 수 있습니다.
          </p>
          <Link
            href="/admin/data-log"
            className="inline-block bg-[#3449FF] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
          >
            출처 로그 관리
          </Link>
        </div>
      </div>
    </div>
  );
} 