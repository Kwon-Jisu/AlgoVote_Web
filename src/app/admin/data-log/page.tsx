import React from 'react';
import Link from 'next/link';
import DataLogForm from '@/components/admin/data-log-form';
import { getDataLogs } from '@/lib/supabase';

export default async function AdminDataLogPage() {
  // 데이터 로그 가져오기
  const dataLogs = await getDataLogs();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">출처 로그 관리</h1>
        <Link 
          href="/" 
          className="text-primary hover:underline inline-flex items-center"
        >
          <i className="ri-home-line mr-1"></i> 홈으로 돌아가기
        </Link>
      </div>
      
      {/* 데이터 로그 폼 */}
      <div className="mb-12">
        <DataLogForm />
      </div>
      
      {/* 데이터 로그 목록 */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">기존 데이터 로그 목록</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-background">
                <th className="border border-divider p-3 text-left">ID</th>
                <th className="border border-divider p-3 text-left">날짜</th>
                <th className="border border-divider p-3 text-left">출처 기관</th>
                <th className="border border-divider p-3 text-left">업데이트 대상</th>
                <th className="border border-divider p-3 text-left">변경사항</th>
              </tr>
            </thead>
            <tbody>
              {dataLogs.length > 0 ? (
                dataLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="border border-divider p-3">{log.id}</td>
                    <td className="border border-divider p-3">{new Date(log.update_date).toLocaleDateString('ko-KR')}</td>
                    <td className="border border-divider p-3">{log.source_organization}</td>
                    <td className="border border-divider p-3">{log.update_target}</td>
                    <td className="border border-divider p-3">{log.change_summary}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="border border-divider p-3 text-center text-text-secondary">
                    데이터 로그가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-center text-text-secondary text-sm mt-8">
        이 페이지는 관리자 전용입니다. 데이터 로그 추가 후에는 페이지가 자동으로 새로고침되지 않습니다.
      </div>
    </div>
  );
} 