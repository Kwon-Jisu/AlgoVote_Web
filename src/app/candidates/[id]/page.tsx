'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PledgeAccordion from '@/components/candidates/PledgeAccordion';
import { getCandidateDataById, regionalPolicies } from '@/data/candidates';
import RegionalPolicyCard from '@/components/regional-policy-card';

// 타입 정의 추가
type Policy = {
  icon: string;
  text: string;
};

type RegionalPolicy = {
  candidateId: string;
  name: string;
  policies: Policy[];
};

export default function CandidateDetail() {
  const [selectedPledge, setSelectedPledge] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pledges' | 'statements' | 'qna'>('pledges');
  const params = useParams();
  const candidateId = params.id as string;
  
  // candidates.ts에서 데이터 가져오기
  const { candidate, pledges} = getCandidateDataById(candidateId);

  // 후보자 데이터가 없는 경우 처리
  if (!candidate) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">후보자 정보를 찾을 수 없습니다</h1>
          <p className="text-text-secondary mb-4">해당 후보자 정보를 찾을 수 없습니다.</p>
          <Link href="/" className="text-primary font-medium hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const handleTabChange = (tab: 'pledges' | 'statements' | 'qna') => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-background min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* 상단 내비게이션 */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-primary font-medium flex items-center">
            <i className="ri-arrow-left-line mr-1"></i>
            후보 목록으로
          </Link>
          <Link href="/compare" className="bg-primary text-white py-2 px-6 rounded-button font-medium transition-all hover:bg-opacity-90">
            다른 후보와 비교하기
          </Link>
        </div>
        
        {/* 후보자 프로필 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 flex flex-col md:flex-row md:items-start">
          <div className="flex-shrink-0 flex justify-center md:justify-start w-full md:w-[240px] mb-6 md:mb-0">
            {candidate.profileImage && (
              <Image
                src={candidate.profileImage}
                alt={candidate.name}
                width={200}
                height={300}
                className="rounded-xl border border-divider object-cover w-[200px] h-[300px] bg-gray-100"
              />
            )}
          </div>
          <div className="flex-1 md:ml-12">
            <div className="flex items-center mb-2">
              <h1 className="text-[32px] font-bold leading-tight mr-3 text-text-primary">{candidate.name}</h1>
              <span className="text-lg font-normal text-text-secondary">{candidate.party}</span>
            </div>
            <blockquote className="text-primary text-3xl md:text-4xl font-semibold leading-snug my-4 font-inklipquid">
              &quot;{candidate.slogan}&quot;
            </blockquote>
            <div className="flex flex-col md:flex-row md:space-x-12 mt-6">
              <div className="mb-4 md:mb-0 min-w-[180px]">
                <div className="text-[16px] text-text-secondary mb-1">나이 / 출생지</div>
                <div className="text-[16px] text-text-primary font-medium mb-3">{candidate.age}세 / {candidate.birthplace}</div>
                <div className="text-[16px] text-text-secondary mb-1">학력</div>
                <ul className="text-[16px] text-text-primary font-medium list-disc list-inside">
                  {candidate.education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </div>
              <div className="flex-1">
                <div className="text-[16px] text-text-secondary mb-1">주요 경력</div>
                <ul className="text-[16px] text-text-primary font-medium list-disc list-inside">
                  {candidate.career.map((career, index) => (
                    <li key={index}>{career}</li>
                  ))}
                </ul>
              </div>
            </div>
            {candidate.websiteUrl && (
              <a
                href={candidate.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary text-[16px] font-medium mt-6 hover:underline"
              >
                공식 웹사이트 방문
                <span className="ml-1"><i className="ri-external-link-line"></i></span>
              </a>
            )}
          </div>
        </div>
        
        {/* 탭 내비게이션 */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            <button
              className={`pb-4 text-lg font-medium relative ${
                activeTab === 'pledges'
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => handleTabChange('pledges')}
            >
              10대 공약
              {activeTab === 'pledges' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
              )}
            </button>
            <button
              className={`pb-4 text-lg font-medium relative ${
                activeTab === 'statements'
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => handleTabChange('statements')}
            >
              지역 공약
              {activeTab === 'statements' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
              )}
            </button>
            <button
              className={`pb-4 text-lg font-medium relative ${
                activeTab === 'qna'
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => handleTabChange('qna')}
            >
              토론회 발언
              {activeTab === 'qna' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
              )}
            </button>
          </div>
        </div>
        
        {/* 10대 공약 탭 컨텐츠 */}
        {activeTab === 'pledges' && (
          <>
            {/* 10대 핵심 공약 섹션 */}
            <section className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">10대 핵심 공약</h2>
              <div className="space-y-4">
                {pledges.slice(0, 3).map((pledge) => (
                  <div key={pledge.id} className="pledge-card p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-all">
                    <div className="flex">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3">
                        <span className="font-semibold">{pledge.order}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{pledge.title}</h3>
                        <p className="text-text-secondary mt-1">{pledge.summary}</p>
                        <button 
                          className="pledge-detail-btn text-primary border border-primary rounded-button px-3 py-1 text-sm inline-flex items-center mt-2 whitespace-nowrap"
                          onClick={() => setSelectedPledge(pledge.id)}
                        >
                          <span>공약 전문 보기</span>
                          <i className="ri-arrow-right-line ml-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button 
                  className="bg-primary text-white py-2 px-6 rounded-button font-medium hover:bg-opacity-90 transition-all whitespace-nowrap"
                  onClick={() => document.getElementById('detailed-pledges')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  10대 공약 전체 보기
                </button>
              </div>
            </section>

            {/* 세부 공약 상세 섹션 */}
            <section id="detailed-pledges" className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">세부 공약 상세</h2>

              <div className="space-y-4">
                {pledges.map((pledge) => (
                  <PledgeAccordion 
                    key={pledge.id} 
                    pledge={pledge} 
                    openPledgeId={selectedPledge}
                    setOpenPledgeId={setSelectedPledge}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* 지역별 공약 */}
        {activeTab === 'statements' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">지역별 공약</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {['capital', 'chungcheong', 'yeongnam', 'honam', 'gangwon', 'jeju'].map((region) => {
                const regionalData = regionalPolicies[region as keyof typeof regionalPolicies]?.find(
                  (data: RegionalPolicy) => data.candidateId === candidate.id
                );
                
                return (
                  <RegionalPolicyCard
                    key={region}
                    candidate={candidate}
                    selectedRegion={region}
                    regionalPolicy={regionalData}
                    showChatbotLink={false}
                    showProfile={false}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* 토론회 발언 */}
        {activeTab === 'qna' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">토론회 주요 발언 및 Q&A</h2>
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">준비 중입니다</h3>
              <p className="text-gray-500">해당 콘텐츠는 현재 준비 중입니다. 빠른 시일 내에 제공하겠습니다.</p>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">향후 토론회 일정</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">날짜</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">내용</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-800">5월 18일</td>
                      <td className="py-3 px-4 text-gray-800">1차 후보자토론회 (주제: 경제)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-800">5월 23일</td>
                      <td className="py-3 px-4 text-gray-800">2차 후보자토론회 (주제: 사회)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-800">5월 27일</td>
                      <td className="py-3 px-4 text-gray-800">3차 후보자토론회 (주제: 정치)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 