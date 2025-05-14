import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getDataLogs, type DataLog } from '@/lib/supabase';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '데이터 업데이트 로그 | 알고투표',
  description: '알고투표의 모든 데이터 수집 및 갱신 과정을 투명하게 기록하고 있습니다.',
};

// 서버 컴포넌트로 데이터 가져오기
async function DataLogPage() {
  // 데이터 로그 가져오기
  const dataLogs = await getDataLogs();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">📚 데이터 업데이트 로그</h1>
      
      <p className="text-text-secondary mb-8">
        "알고투표는 모든 데이터 수집 및 갱신 과정을 투명하게 기록하고 있습니다."
      </p>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">✅ 업데이트 기록</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-background">
                <th className="border border-divider p-3 text-left">업데이트 날짜</th>
                <th className="border border-divider p-3 text-left">출처 기관</th>
                <th className="border border-divider p-3 text-left">출처 링크</th>
                <th className="border border-divider p-3 text-left">업데이트 대상</th>
                <th className="border border-divider p-3 text-left">주요 변경사항 요약</th>
                <th className="border border-divider p-3 text-left">비고</th>
              </tr>
            </thead>
            <tbody>
              {dataLogs.length > 0 ? (
                dataLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="border border-divider p-3">{new Date(log.update_date).toLocaleDateString('ko-KR')}</td>
                    <td className="border border-divider p-3">{log.source_organization}</td>
                    <td className="border border-divider p-3">
                      <a 
                        href={log.source_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        링크
                      </a>
                    </td>
                    <td className="border border-divider p-3">{log.update_target}</td>
                    <td className="border border-divider p-3">{log.change_summary}</td>
                    <td className="border border-divider p-3">{log.note}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="border border-divider p-3 text-center text-text-secondary">
                    업데이트 기록이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🛠️ 유의사항</h2>
        <ul className="list-disc pl-6 text-text-secondary space-y-2">
          <li>모든 데이터는 공식 기관 자료를 기반으로 수집 및 검증되었습니다.</li>
          <li>링크가 만료된 경우, 공식 기관 사이트를 참고해 주세요.</li>
          <li>일부 데이터는 문서 업데이트에 따라 수동으로 갱신될 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}

export default DataLogPage; 