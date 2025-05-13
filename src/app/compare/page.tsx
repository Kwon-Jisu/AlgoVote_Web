'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { candidates, categoryDescriptions, regionalPolicies, pledges, subCategories, subCategoryPolicies } from '@/data/candidates';
import RegionalPolicyCard from '@/components/regional-policy-card';

// 서브 카테고리 정책 데이터 타입 정의
type PolicyData = {
  title: string;
  details: string[];
};

export default function Compare() {
  const [viewType, setViewType] = useState<'category' | 'region'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('경제·산업');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState('capital');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // 선택한 카테고리의 서브 카테고리 목록
  const currentSubCategories = React.useMemo(() => {
    return selectedCategory ? subCategories[selectedCategory as keyof typeof subCategories] || [] : [];
  }, [selectedCategory]);

  // 카테고리 선택 시 첫 번째 서브 카테고리 자동 선택
  useEffect(() => {
    if (currentSubCategories.length > 0) {
      setSelectedSubCategory(currentSubCategories[0]);
    } else {
      setSelectedSubCategory('');
    }
  }, [currentSubCategories]);

  // 카테고리별 정책 항목 준비
  const policyItems = React.useMemo(() => {
    // 선택된 카테고리에 해당하는 모든 정책 가져오기
    const filteredPledges = pledges.filter(pledge => 
      pledge.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(pledge.category.toLowerCase().split('/')[0])
    );
    
    // 정책 항목들을 제목 기준으로 그룹화
    const uniqueTitles = [...new Set(filteredPledges.map(p => p.title))];
    
    return uniqueTitles.map(title => {
      const relatedPledges = filteredPledges.filter(p => p.title === title);
      
      return {
        id: title.toLowerCase().replace(/\s+/g, '-'),
        title: title,
        policies: relatedPledges.map(pledge => ({
          candidate: candidates.find(c => c.id === pledge.candidateId)?.name || '',
          candidateId: pledge.candidateId,
          summary: pledge.summary,
          details: pledge.content,
          source: '후보 공식 정책집'
        }))
      };
    });
  }, [selectedCategory]);

  // 서브 카테고리별 정책 데이터 가져오기
  const subCategoryPolicyData = React.useMemo(() => {
    if (!selectedCategory || !selectedSubCategory) return [];

    // 간단한 형태로 변경하여 안전하게 데이터에 접근
    // 후보자별로 데이터 있는 경우만 배열에 포함
    const result = [];
    
    for (const candidate of candidates) {
      const candidateId = candidate.id;
      
      // 해당 후보자의 데이터가 존재하는지 확인
      const candidatePolicies = subCategoryPolicies[candidateId as keyof typeof subCategoryPolicies];
      if (!candidatePolicies) continue;
      
      // 해당 카테고리의 데이터가 존재하는지 확인
      const categoryPolicies = candidatePolicies[selectedCategory as keyof typeof candidatePolicies];
      if (!categoryPolicies) continue;
      
      // 서브 카테고리의 데이터가 존재하는지 확인 및 타입 안전하게 접근
      // @ts-expect-error - 동적 키로 접근하기 때문에 타입 체크를 무시
      const policyData = categoryPolicies[selectedSubCategory] as PolicyData | undefined;
      if (!policyData) continue;
      
      // 모든 조건을 통과한 후보와 정책 데이터를 결과에 추가
      result.push({ candidate, policyData });
    }
    
    return result;
  }, [selectedCategory, selectedSubCategory]);

  const handleViewTypeChange = (type: 'category' | 'region') => {
    setViewType(type);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setActiveSlideIndex(0); // 카테고리 변경 시 첫 번째 슬라이드로 초기화
  };

  const handleSubCategoryChange = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
  };


  // 슬라이드 변경 처리
  const handleSlideChange = (index: number) => {
    setActiveSlideIndex(index);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: index * window.innerWidth,
        behavior: 'smooth'
      });
    }
  };

  // 스와이프 처리를 위한 터치 이벤트 관리
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let startX: number;
    let currentX: number;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const diff = startX - currentX;
      const threshold = 100; // 스와이프 임계값

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && activeSlideIndex < policyItems.length - 1) {
          // 왼쪽으로 스와이프
          handleSlideChange(activeSlideIndex + 1);
        } else if (diff < 0 && activeSlideIndex > 0) {
          // 오른쪽으로 스와이프
          handleSlideChange(activeSlideIndex - 1);
        }
      }
    };

    // 스크롤 스냅 처리
    const handleScroll = () => {
      if (!slider) return;
      
      const scrollPosition = slider.scrollLeft;
      const slideWidth = window.innerWidth;
      const newIndex = Math.round(scrollPosition / slideWidth);
      
      if (newIndex !== activeSlideIndex) {
        setActiveSlideIndex(newIndex);
      }
    };

    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchmove', handleTouchMove);
    slider.addEventListener('touchend', handleTouchEnd);
    slider.addEventListener('scroll', handleScroll);

    return () => {
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchmove', handleTouchMove);
      slider.removeEventListener('touchend', handleTouchEnd);
      slider.removeEventListener('scroll', handleScroll);
    };
  }, [activeSlideIndex, policyItems.length]);

  // 카테고리 키 배열
  const categoryKeys = Object.keys(categoryDescriptions);

  return (
    <div className="bg-background min-h-screen">
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 fade-in">
        <h1 className="text-3xl font-bold text-text-primary text-start mb-10">공약 비교하기</h1>
        
        {/* 비교 기준 선택 영역 */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">비교 기준 선택</h2>
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
          {/* 카테고리 선택 탭 */}
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
                    onChange={() => handleCategoryChange(category)}
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

          {/* 선택된 카테고리 설명 */}
          <div className="mb-6 text-text-secondary">
            <p>{categoryDescriptions[selectedCategory as keyof typeof categoryDescriptions]}</p>
          </div>

          {/* 서브 카테고리 선택 탭 */}
          {currentSubCategories.length > 0 && (
            <div className="overflow-x-auto whitespace-nowrap pb-4 mb-6">
              <div className="flex space-x-3">
                {currentSubCategories.map((subCategory) => (
                  <div key={subCategory} className="relative">
                    <input 
                      type="radio" 
                      id={`sub-${subCategory}`} 
                      name="subcategory" 
                      className="absolute opacity-0 w-0 h-0"
                      checked={selectedSubCategory === subCategory}
                      onChange={() => handleSubCategoryChange(subCategory)}
                    />
                    <label
                      htmlFor={`sub-${subCategory}`}
                      className={`block rounded-full px-5 py-2 font-medium cursor-pointer border ${
                        selectedSubCategory === subCategory 
                          ? 'bg-primary bg-opacity-10 border-primary text-primary' 
                          : 'bg-white border-gray-200 text-text-secondary hover:bg-gray-50'
                      }`}
                    >
                      {subCategory}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {subCategoryPolicyData.map(({ candidate, policyData }) => (
                <div 
                  key={candidate.id} 
                  className="bg-white rounded-xl shadow-sm p-6 border border-divider hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-5">
                    <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-4">
                      {candidate.profileImage && (
                        <Image 
                          src={candidate.profileImage} 
                          alt={candidate.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{candidate.name}</h3>
                      <p className="text-text-secondary text-sm">{candidate.party}</p>
                    </div>
                  </div>

                  {policyData && (
                    <>
                      <h4 className="text-lg font-medium text-primary mb-3">{policyData.title}</h4>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mt-4">
                        <h5 className="font-medium text-text-primary mb-3">상세 정책</h5>
                        <ul className="list-disc pl-5 text-text-secondary space-y-2">
                          {policyData.details.map((detail: string, i: number) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          
        </section>

        {/* 지역별 보기 섹션 */}
        <section id="region-section" className={`mb-8 ${viewType === 'region' ? 'block' : 'hidden'}`}>
          <div className="overflow-x-auto whitespace-nowrap pb-4 mb-6">
            <div className="flex space-x-3">
              {['capital', 'chungcheong', 'yeongnam', 'honam', 'gangwon', 'jeju', 'border'].map((region) => (
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
                    {region === 'border' && '접경지'}
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
                <RegionalPolicyCard
                  key={candidate.id}
                  candidate={candidate}
                  selectedRegion={selectedRegion}
                  regionalPolicy={regionalData}
                />
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
              <p className="text-text-secondary">후보자 AI에게 질문하고 더 자세한 정보를 얻어보세요.</p>
            </div>
          </div>
          <Link
            href="/chatbot"
            className="bg-primary text-white px-6 py-3 rounded-button font-medium whitespace-nowrap"
          >
            후보자와 대화하기
          </Link>
        </div>

        {/* 출처 및 업데이트 정보 */}
        <div className="mt-10 text-xs md:text-xs sm:text-[10px] text-[9px] text-text-secondary border-t border-divider pt-4">
          <p>
            ※ 본 정보는 <a href="https://www.nec.go.kr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">중앙선거관리위원회</a>, 
            각 후보 선거캠프 공식 발표 자료를 기반으로 작성되었습니다.
            {candidates.slice(0, 3).map((candidate, index) => (
              <React.Fragment key={candidate.id}>
                {index > 0 && ", "}
                <a 
                  href={candidate.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline"
                >
                  {candidate.name} 후보
                </a>
              </React.Fragment>
            ))}
          </p>
          <p className="mt-1">※ 최종 업데이트: 2025년 5월 기준</p>
          <p className="mt-1">※ 각 후보의 정책은 선거 과정에서 변경될 수 있으며, 가장 정확한 정보는 후보 공식 웹사이트를 참고하시기 바랍니다.</p>
        </div>
      </main>
    </div>
  );
} 