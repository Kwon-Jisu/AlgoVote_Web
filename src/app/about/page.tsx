'use client';

import React from 'react';
import Image from 'next/image';
import { TeamMember } from '@/types';

// Mock team members data (will be replaced with Supabase data later)
const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: '정다인',
    role: 'Director',
    image: '/images/team/jung-dain.jpg',
    linkedin: 'https://www.linkedin.com/in/daino-jung?utm_source=algotovote.com&utm_medium=referral&utm_campaign=about-page'
  },
  {
    id: '2',
    name: '권지수',
    role: 'RAG&ChatBot',
    image: '/images/team/kwon-jisoo.jpg',
    linkedin: 'https://www.linkedin.com/in/kwon-jisu?utm_source=algotovote.com&utm_medium=referral&utm_campaign=about-page'
  },
  {
    id: '3',
    name: '이지윤',
    role: 'RAG&ChatBot',
    image: '/images/team/lee-jiyoon.jpg',
    linkedin: 'https://www.linkedin.com/in/jiyoon-lee-2b2571209?utm_source=algotovote.com&utm_medium=referral&utm_campaign=about-page'
  },
  {
    id: '4',
    name: '곽예림',
    role: 'PM&Marketing',
    image: '/images/team/kwak-yerim.jpg',
    linkedin: 'https://www.linkedin.com/in/christopher?utm_source=algotovote.com&utm_medium=referral&utm_campaign=about-page'
  },
  {
    id: '5',
    name: '양지은',
    role: 'Data',
    image: '/images/team/yang-jiyeon.jpg',
    linkedin: 'https://www.linkedin.com/in/crystal?utm_source=algotovote.com&utm_medium=referral&utm_campaign=about-page'
  }
];

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <main className="pt-18 sm:pt-24 pb-16">
        {/* 인트로 섹션 */}
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-20 text-center fade-in">
          <blockquote className="text-2xl md:text-4xl font-bold text-text-primary max-w-3xl mx-auto">
            &quot;공약을 모르고 투표하는 일은 없도록&quot;
          </blockquote>
        </section>

        {/* 서비스 소개 섹션 */}
        <section className="container mx-auto px-4 md:px-6 py-12 md:py-16 fade-in">
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-text-secondary leading-relaxed mb-6">
              &apos;이 사람이 어떤 정책을 내세우는지&apos;보다, &apos;그냥 괜찮아 보이니까&apos;가 기준이 되곤 했습니다.<br></br>
              정책과 비전을 직접 비교하며 판단할 수 있다면, 더 나은 선택이 가능하지 않을까.그 물음에서 &apos;알고투표&apos;는 시작됐습니다.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              정치적 중립성과 객관성을 바탕으로, 누구나 공약을 비교하고 판단할 수 있도록 돕는 것.<br></br>
              그것이 우리가 생각하는 더 나은 민주주의의 출발점입니다.
            </p>
          </div>
        </section>

        {/* 제작진 소개 섹션 */}
        <section className="container mx-auto px-4 md:px-6 py-12 md:py-16 fade-in">
          <h2 className="text-2xl font-bold text-text-primary mb-16 text-center">제작진 소개</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10">
            {teamMembers.map(member => (
              <div key={member.id} className="flex flex-col items-center text-center">
                <div className="relative w-full pb-[100%] bg-[#E5E7EB] rounded-2xl overflow-hidden mb-4">
                  {/* 링크드인 아이콘 */}
                  {member.linkedin && (
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute top-2.5 right-2.5 z-10 w-8 h-8 bg-black rounded-button flex items-center justify-center"
                      aria-label={`${member.name}의 링크드인 프로필`}
                    >
                      <i className="ri-linkedin-fill text-white"></i>
                    </a>
                  )}
                  
                  {/* 프로필 이미지 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {member.image ? (
                      <Image 
                        src={member.image} 
                        alt={member.name} 
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.classList.add('fallback-icon');
                        }}
                      />
                    ) : (
                      <i className="ri-user-smile-line ri-3x text-text-secondary"></i>
                    )}
                  </div>
                  
                  {/* 이미지 로드 실패시 표시될 fallback 아이콘 */}
                  <div className="fallback-icon hidden absolute inset-0 flex items-center justify-center">
                    <i className="ri-user-smile-line ri-3x text-text-secondary"></i>
                  </div>
                </div>
                
                {/* 역할 및 이름 */}
                <p className="text-sm text-text-secondary font-medium mb-1">{member.role}</p>
                <h3 className="font-bold text-lg text-text-primary">{member.name}</h3>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col items-center justify-center text-text-secondary py-6">
          <h5 className="text-text-primary">
            프로젝트 문의: 
            <a 
              href="mailto:contact@algovote.info?subject=[알고투표] 프로젝트 문의" 
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 hover:underline transition-colors"
            >
              contact@algovote.info
            </a>
          </h5>
        </div>

        {/* 후원 안내 섹션 */}
        <section className="bg-background py-12 md:py-16 mt-8 fade-in">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">작은 응원이 다음 프로젝트를 만듭니다.</h2>
              <p className="text-text-secondary mb-6">
                알고투표는 비영리 프로젝트로 운영되고 있습니다.<br />
                여러분의 작은 후원이 더 나은 민주주의 도구를 만드는 데 큰 힘이 됩니다.
              </p>
              <button className="bg-white text-text-primary border border-divider hover:bg-gray-100 transition-colors px-6 py-3 rounded-button font-medium flex items-center mx-auto whitespace-nowrap">
                <div className="w-6 h-6 flex items-center justify-center mr-2">
                  <i className="ri-cup-line"></i>
                </div>
                Buy Me a Coffee
              </button>
            </div>
          </div>
        </section>

        
      </main>
    </div>
  );
} 