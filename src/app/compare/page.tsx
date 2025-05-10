'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { candidates, comparisonData, categoryDescriptions, regionalPolicies } from '@/data/candidates';

// 타입 정의
type PolicyDetail = {
  candidate: string;
  candidateId: string;
  summary: string;
  details: string[];
  source: string;
};

type PolicyItem = {
  id: string;
  title: string;
  policies: PolicyDetail[];
};

// 카테고리 데이터에 대한 타입 정의
type CategoryData = Record<string, string>;

export default function Compare() {
  const [viewType, setViewType] = React.useState<'category' | 'region'>('category');
  const [selectedCategory, setSelectedCategory] = React.useState<keyof typeof comparisonData>('경제');
  const [selectedRegion, setSelectedRegion] = React.useState('capital');
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  const handleViewTypeChange = (type: 'category' | 'region') => {
    setViewType(type);
  };

  const toggleItemExpand = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // 초기화 함수 추가
  React.useEffect(() => {
    const toggleContents = document.querySelectorAll('.toggle-content');
    toggleContents.forEach(content => {
      (content as HTMLElement).style.display = 'none';
    });
    
    // 토글 버튼 이벤트 리스너 추가
    const handleToggleClick = (e: Event) => {
      const button = e.currentTarget as HTMLElement;
      const content = button.nextElementSibling as HTMLElement;
      
      if (content && content.classList.contains('toggle-content')) {
        const span = button.querySelector('span');
        const icon = button.querySelector('i');
        
        if (content.style.display === 'block') {
          content.style.display = 'none';
          if (span) span.textContent = '더 보기';
          if (icon) icon.className = 'ri-arrow-down-s-line';
        } else {
          content.style.display = 'block';
          if (span) span.textContent = '접기';
          if (icon) icon.className = 'ri-arrow-up-s-line';
        }
      }
    };
    
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
      button.addEventListener('click', handleToggleClick);
    });
    
    return () => {
      toggleButtons.forEach(button => {
        button.removeEventListener('click', handleToggleClick);
      });
    };
  }, [viewType, selectedCategory]); // 뷰 타입이나 카테고리가 변경될 때마다 재실행

  // comparisonData에서 정책 아이템 생성
  const policyItems = React.useMemo((): PolicyItem[] => {
    // 선택된 카테고리에 해당하는 데이터만 필터링
    if (!comparisonData[selectedCategory]) return [];

    // 타입 캐스팅을 명시적으로 수행
    const categoryData = comparisonData[selectedCategory] as CategoryData;
    
    // 정책 항목 생성
    return [
      {
        id: `${selectedCategory.toLowerCase()}-policy`,
        title: selectedCategory,
        policies: candidates.map(candidate => {
          const candidateId = candidate.id;
          // candidateId가 string이므로 인덱싱 가능
          const policyDetails = categoryData[candidateId]?.split(' · ') || [];
          
          return {
            candidate: candidate.name,
            candidateId,
            summary: categoryData[candidateId] || '-',
            details: policyDetails,
            source: '후보 공식 정책집 (PDF)'
          };
        }).filter(policy => policy.summary !== '-') // 정책이 없는 후보는 제외
      }
    ];
  }, [selectedCategory]);

  // categoryDescription에 있는 카테고리 키 배열
  const categoryKeys = Object.keys(categoryDescriptions) as Array<keyof typeof categoryDescriptions>;

  return (
    <div className="bg-background min-h-screen">
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in">
        <h1 className="text-3xl font-bold text-text-primary text-start mb-10">공약 비교하기</h1>
        
        {/* 비교 기준 선택 영역 */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">비교 기준 선택</h2>
            <div className="relative group">
              <div className="w-6 h-6 flex items-center justify-center text-text-secondary cursor-help">
                <i className="ri-information-line"></i>
              </div>
              <span className="absolute right-0 top-full w-64 p-3 bg-white shadow-lg rounded-lg border border-divider text-xs text-text-secondary z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                동시에 두 기준을 선택할 수는 없습니다.
              </span>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="relative">
              <input 
                type="radio" 
                id="category-view" 
                name="view-type" 
                className="absolute opacity-0 w-0 h-0"
                checked={viewType === 'category'}
                onChange={() => handleViewTypeChange('category')}
              />
              <label
                htmlFor="category-view"
                className={`block border-2 rounded-full px-5 py-2 font-medium cursor-pointer ${
                  viewType === 'category' 
                    ? 'border-primary bg-primary bg-opacity-5 text-primary' 
                    : 'border-gray-300 text-text-secondary hover:border-gray-400'
                }`}
              >
                정책 카테고리별 보기
              </label>
            </div>

            <div className="relative">
              <input 
                type="radio" 
                id="region-view" 
                name="view-type" 
                className="absolute opacity-0 w-0 h-0"
                checked={viewType === 'region'}
                onChange={() => handleViewTypeChange('region')}
              />
              <label
                htmlFor="region-view"
                className={`block border-2 rounded-full px-5 py-2 font-medium cursor-pointer ${
                  viewType === 'region' 
                    ? 'border-primary bg-primary bg-opacity-5 text-primary' 
                    : 'border-gray-300 text-text-secondary hover:border-gray-400'
                }`}
              >
                지역별 보기
              </label>
            </div>
          </div>
        </div>

        {/* 정책 카테고리별 보기 섹션 */}
        <section id="category-section" className={`mb-8 ${viewType === 'category' ? 'block' : 'hidden'}`}>
          <div className="overflow-x-auto whitespace-nowrap pb-4 mb-6">
            <div className="flex space-x-3">
              {categoryKeys.map((category) => (
                <div key={category} className="relative">
                  <input 
                    type="radio" 
                    id={category} 
                    name="category" 
                    className="absolute opacity-0 w-0 h-0"
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                  />
                  <label
                    htmlFor={category}
                    className={`block rounded-full px-5 py-2 font-medium cursor-pointer ${
                      selectedCategory === category 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {selectedCategory && categoryDescriptions[selectedCategory] && (
            <div className="mb-6 text-text-secondary">
              <p>{categoryDescriptions[selectedCategory]}</p>
            </div>
          )}

          {/* 데스크탑: 기존 테이블 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[768px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left w-[15%]">정책 항목</th>
                  {candidates.slice(0, 3).map(candidate => (
                    <th key={candidate.id} className="p-4 text-left w-[21.25%]">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-3">
                          {candidate.profileImage && (
                            <Image 
                              src={candidate.profileImage} 
                              alt={candidate.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <span className="font-bold text-lg">{candidate.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {policyItems.map((item) => (
                  <tr key={item.id}>
                    <td className="p-4 border-t border-gray-200 align-top">
                      <div className="font-medium">{item.title}</div>
                    </td>
                    {item.policies.map((policy, index) => (
                      <td key={index} className="p-4 border-t border-gray-200">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <p>{policy.summary}</p>
                          <div className="mt-2">
                            <button
                              className="flex items-center text-sm text-primary"
                              onClick={() => toggleItemExpand(`${item.id}-${index}`)}
                            >
                              <span>{expandedItems[`${item.id}-${index}`] ? '접기' : '더 보기'}</span>
                              <div className="w-5 h-5 flex items-center justify-center ml-1">
                                <i className={expandedItems[`${item.id}-${index}`] ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}></i>
                              </div>
                            </button>
                            <div className={`mt-2 text-sm text-gray-600 ${expandedItems[`${item.id}-${index}`] ? 'block' : 'hidden'}`}> 
                              {policy.details && policy.details.map((detail: string, detailIndex: number) => (
                                <p key={detailIndex}>- {detail}</p>
                              ))}
                              <div className="mt-2 text-xs text-gray-500">
                                출처:
                                <span className="text-primary underline ml-1">{policy.source}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일: 정책항목 x축, 후보자 y축 */}
          <div className="block md:hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left w-[20%]">정책항목</th>
                  {policyItems.map((item) => (
                    <th key={item.id} className="p-4 text-left">
                      <div className="font-medium">{item.title}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {candidates.slice(0, 3).map((candidate, cIdx) => (
                  <tr key={candidate.id}>
                    <td className="p-4 border-t border-gray-200 align-top">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mb-2">
                          {candidate.profileImage && (
                            <Image 
                              src={candidate.profileImage} 
                              alt={candidate.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <span className="font-bold text-base text-center">{candidate.name}</span>
                      </div>
                    </td>
                    {policyItems.map((item) => {
                      const candidatePolicy = item.policies.find(p => p.candidate === candidate.name);
                      return (
                        <td key={item.id} className="p-4 border-t border-gray-200">
                          <div className="bg-white rounded-lg shadow-sm p-4">
                            <p>{candidatePolicy?.summary || '-'}</p>
                            {candidatePolicy && (
                              <div className="mt-2">
                                <button
                                  className="flex items-center text-sm text-primary"
                                  onClick={() => toggleItemExpand(`${item.id}-mobile-${cIdx}`)}
                                >
                                  <span>{expandedItems[`${item.id}-mobile-${cIdx}`] ? '접기' : '더 보기'}</span>
                                  <div className="w-5 h-5 flex items-center justify-center ml-1">
                                    <i className={expandedItems[`${item.id}-mobile-${cIdx}`] ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}></i>
                                  </div>
                                </button>
                                <div className={`mt-2 text-sm text-gray-600 ${expandedItems[`${item.id}-mobile-${cIdx}`] ? 'block' : 'hidden'}`}> 
                                  {candidatePolicy.details && candidatePolicy.details.map((detail: string, detailIndex: number) => (
                                    <p key={detailIndex}>- {detail}</p>
                                  ))}
                                  <div className="mt-2 text-xs text-gray-500">
                                    출처:
                                    <span className="text-primary underline ml-1">{candidatePolicy.source}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 지역별 보기 섹션 */}
        <section id="region-section" className={`mb-8 ${viewType === 'region' ? 'block' : 'hidden'}`}>
          <div className="overflow-x-auto whitespace-nowrap pb-4 mb-6">
            <div className="flex space-x-3">
              {['capital', 'chungcheong', 'yeongnam', 'honam', 'gangwon', 'jeju'].map((region) => (
                <div key={region} className="relative">
                  <input 
                    type="radio" 
                    id={region} 
                    name="region" 
                    className="absolute opacity-0 w-0 h-0"
                    checked={selectedRegion === region}
                    onChange={() => setSelectedRegion(region)}
                  />
                  <label
                    htmlFor={region}
                    className={`block rounded-full px-5 py-2 font-medium cursor-pointer ${
                      selectedRegion === region 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                    }`}
                  >
                    {region === 'capital' && '수도권'}
                    {region === 'chungcheong' && '충청'}
                    {region === 'yeongnam' && '영남'}
                    {region === 'honam' && '호남'}
                    {region === 'gangwon' && '강원'}
                    {region === 'jeju' && '제주'}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.slice(0, 3).map((candidate) => {
              const regionalData = regionalPolicies[selectedRegion as keyof typeof regionalPolicies]?.find(
                data => data.candidateId === candidate.id
              );
              return (
                <div key={candidate.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-100 mr-4">
                        {candidate.profileImage && (
                          <Image 
                            src={candidate.profileImage} 
                            alt={candidate.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <h3 className="text-xl font-bold">{candidate.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-medium text-gray-700 mb-4">
                      {selectedRegion === 'capital' && '수도권 공약'}
                      {selectedRegion === 'chungcheong' && '충청 공약'}
                      {selectedRegion === 'yeongnam' && '영남 공약'}
                      {selectedRegion === 'honam' && '호남 공약'}
                      {selectedRegion === 'gangwon' && '강원 공약'}
                      {selectedRegion === 'jeju' && '제주 공약'}
                    </h4>
                    <ul className="space-y-3">
                      {regionalData?.policies.map((policy, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-6 h-6 flex items-center justify-center text-primary mt-0.5 mr-2">
                            <i className={policy.icon}></i>
                          </div>
                          <span>{policy.text}</span>
                        </li>
                      )) || (
                        <li className="flex items-start">
                          <div className="w-6 h-6 flex items-center justify-center text-primary mt-0.5 mr-2">
                            <i className="ri-information-line"></i>
                          </div>
                          <span>해당 지역 공약 정보가 없습니다.</span>
                        </li>
                      )}
                    </ul>
                    <Link
                      href="/chatbot"
                      className="inline-flex items-center text-primary mt-6"
                    >
                      <span>AI 챗봇으로 정책 질문하기</span>
                      <div className="w-5 h-5 flex items-center justify-center ml-1">
                        <i className="ri-robot-2-line"></i>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 챗봇 배너 */}
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 flex items-center justify-center bg-primary bg-opacity-10 rounded-full mr-4">
              <i className="ri-chat-3-line text-xl text-primary"></i>
            </div>
            <div>
              <h3 className="text-lg font-medium">더 궁금한 공약이 있으신가요?</h3>
              <p className="text-text-secondary">AI 챗봇에게 질문하고 더 자세한 정보를 얻어보세요.</p>
            </div>
          </div>
          <Link
            href="/chatbot"
            className="bg-primary text-white px-6 py-3 rounded-button font-medium whitespace-nowrap"
          >
            챗봇에게 질문하러 가기
          </Link>
        </div>
      </main>
    </div>
  );
} 