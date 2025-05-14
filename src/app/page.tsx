import React from 'react';
import Link from 'next/link';
import CandidateCard from '@/components/cards/CandidateCard';
import { candidates } from '@/data/candidates';
import Image from 'next/image';

export default function Home() {
  // 주요 후보자 3명만 표시
  const mainCandidates = candidates.slice(0, 4);
  
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-4xl text-center fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6 whitespace-nowrap">정확한 정보를 바탕으로, 현명한 선택을</h1>
          <p className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto mb-8">
            더 나은 선택은 객관적인 정보 비교에서 시작됩니다.<br></br>
            알고투표는 유권자가 정책과 비전을 쉽게 비교하고<br></br>
            현명한 결정을 내릴 수 있도록 돕는 플랫폼입니다.
          </p>

          <div className="flex justify-center">
            <Link href="/chatbot" className="btn-primary whitespace-nowrap">
              후보자와 대화하기
            </Link>
          </div>
        </div>
      </section>

      {/* 주요 후보자 섹션 */}
      <section className="py-12 sm:py-16 md:py-20  px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex items-start justify-center mb-0 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-text-primarytext-center whitespace-nowrap">제 21대 대선 주요 후보자</h2>
            <div className="relative group">
                <div className="w-6 h-6 flex items-center justify-center text-text-secondary cursor-help">
                  <i className="ri-information-line"></i>
                </div>
                <span className="absolute right-0 top-full w-64 p-3 bg-white shadow-lg rounded-lg border border-divider text-xs text-text-secondary z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  알고투표는 유권자들의 정보 접근성을 높이기 위해, 주요 후보들을 중심으로 정보를 제공하고 있습니다.
                </span>
            </div>
          </div>
          {/* 모바일에서만 보이는 안내 메시지 */}
          <div className="md:hidden p-4 mb-2 text-center text-text-secondary text-sm">
            클릭시 각 후보자별 세부공약을 확인할 수 있습니다.
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-8">
            {mainCandidates.map((candidate) => (
              <div key={candidate.id}>
                <CandidateCard candidate={candidate} />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/compare" className="text-primary hover:underline flex items-center justify-center">
              <span>대선 공약 비교하기</span>
              <i className="ri-arrow-right-line ml-1"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-12 text-center">알고투표의 특징</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="ri-scales-3-line text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">객관적 비교</h3>
              <p className="text-text-secondary text-center">각 후보자의 공약과 정책을<br></br>
                객관적인 기준으로 비교하여 제공합니다.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="ri-search-line text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">팩트 체크</h3>
              <p className="text-text-secondary text-center">후보자들의 발언과 공약에 대한<br></br>
                사실 확인 정보를 제공합니다.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="ri-robot-2-line text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">AI 질의응답</h3>
              <p className="text-text-secondary text-center">AI 후보자와의 대화를 통해<br></br>
                정책과 비전에 대한 정보를 제공합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl bg-primary bg-opacity-5 rounded-2xl p-8 mb-12 sm:p-12 ">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">투표일 안내</h2>
            <p className="text-text-secondary mb-8 whitespace-nowrap">2025년 6월 3일 (화) 오전 6시 ~ 오후 8시</p>
            <Link href="/voting-info" className="btn-primary inline-block whitespace-nowrap">
              투표 방법 알아보기
            </Link>
          </div>
        </div>
        {/* 데이터 출처 안내 */}
        <div className="flex flex-col items-center justify-center">
          <Link href="/data-log">
            <div className="flex flex-row justify-center items-center gap-2 mb-2 relative">
                  <div className="flex items-center gap-8">
                    <Image 
                      src="/images/sources/national-election-commission.png"
                      alt="중앙선거관리위원회"
                      width={100}
                      height={100}
                      className="w-[150px] h-auto sm:w-[150px] md:w-[200px] object-contain"
                    />
                    <Image 
                      src="/images/sources/central-election-broadcast-debate-committee.png"
                      alt="중앙선거방송토론위원회"
                      width={100}
                      height={100}
                      className="w-[150px] h-auto sm:w-[150px] md:w-[200px] object-contain"
                    />
                  </div>
                  <div className="relative group mb-2">
                    <div className="w-6 h-6 flex items-center justify-center text-text-secondary cursor-help">
                      <i className="ri-information-line"></i>
                    </div>
                    <span className="absolute right-0 top-full w-72 p-3 bg-white shadow-lg rounded-lg border border-divider text-xs text-text-secondary z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      본 서비스는 다음 기관의 공식 자료를 기반으로 데이터 수집 및 가공되었습니다. 클릭시 데이터 수집 현황이 표시됩니다.
                    </span>
                  </div>
            </div>
          </Link>
          </div>
      </section>
    </div>
  );
} 