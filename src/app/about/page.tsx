'use client';

import React, { useEffect } from 'react';
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
    linkedin: 'https://www.linkedin.com/in/yelimkwak/?utm_source=algotovote.com&utm_medium=referral&utm_campaign=about-page'
  },
  {
    id: '5',
    name: '양지은',
    role: 'Data',
    image: '/images/team/yang-jiyeon.jpg',
    linkedin: 'https://www.linkedin.com/in/je-y-8282a8365?utm_source=algotovote.com&utm_medium=referral&utm_campaign=about-page'
  }
];

export default function About() {
  useEffect(() => {
    // 기존 스크립트 제거
    const existingScript = document.getElementById('bmc-script');
    if (existingScript) {
      existingScript.remove();
    }
    
    // 새 스크립트 생성
    const script = document.createElement('script');
    script.id = 'bmc-script';
    script.type = 'text/javascript';
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.dataset.name = 'bmc-button';
    script.dataset.slug = 'daino_saur';
    script.dataset.color = '#FFDD00';
    script.dataset.emoji = '☕';
    script.dataset.font = 'Inter';
    script.dataset.text = 'Buy me a coffee';
    script.dataset.outlineColor = '#000000';
    script.dataset.fontColor = '#000000';
    script.dataset.coffeeColor = '#ffffff';
    script.async = true;
    
    // 스크립트 추가
    document.body.appendChild(script);
    
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

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
              정책과 비전을 직접 비교하며 판단할 수 있다면, 더 나은 선택이 가능하지 않을까. 그 물음에서 &apos;알고투표&apos;는 시작됐습니다.
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
              <a 
                key={member.id} 
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="relative w-full pb-[100%] bg-[#E5E7EB] rounded-2xl overflow-hidden mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {/* 링크드인 아이콘 */}
                  {member.linkedin && (
                    <div 
                      className="absolute top-2.5 right-2.5 z-10 w-8 h-8 bg-black group-hover:bg-primary rounded-button flex items-center justify-center transition-colors"
                      aria-label={`${member.name}의 링크드인 프로필`}
                    >
                      <i className="ri-linkedin-fill text-white"></i>
                    </div>
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
              </a>
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
              <p className="text-text-secondary mb-8">
                알고투표는 비영리 프로젝트로 운영되고 있습니다.<br />
                여러분의 작은 후원이 더 나은 민주주의 도구를 만드는 데 큰 힘이 됩니다.
              </p>
              <div className="flex justify-center">
                <style jsx>{`
                  .coffee-btn {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    padding: 0.75rem 1.5rem;
                    background-color: #FFDD00;
                    color: black;
                    font-weight: bold;
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    transition: all 0.3s ease;
                    overflow: hidden;
                  }
                  
                  .coffee-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                  }
                  
                  .btn-content {
                    position: relative;
                    z-index: 10;
                  }
                  
                  .heart {
                    position: absolute;
                    opacity: 0;
                    transition: opacity 0.1s ease;
                    font-size: 1.25rem;
                    color: #EF4444;
                  }
                  
                  .coffee-btn:hover .heart {
                    opacity: 1;
                    animation: float-up 1.5s ease-out forwards;
                  }
                  
                  .heart-1 {
                    top: 5px;
                    left: 10px;
                  }
                  
                  .heart-2 {
                    top: 5px;
                    left: 35%;
                    animation-delay: 0.15s !important;
                  }
                  
                  .heart-3 {
                    top: 5px;
                    left: 60%;
                    animation-delay: 0.3s !important;
                  }
                  
                  .heart-4 {
                    top: 5px;
                    right: 10px;
                    animation-delay: 0.45s !important;
                  }
                  
                  @keyframes float-up {
                    0% {
                      transform: translateY(0);
                      opacity: 1;
                    }
                    100% {
                      transform: translateY(-20px) rotate(10deg);
                      opacity: 0;
                    }
                  }
                `}</style>
                <a 
                  href="https://www.buymeacoffee.com/daino_saur" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="coffee-btn"
                >
                  <span className="heart heart-1">❤️</span>
                  <span className="heart heart-2">❤️</span>
                  <span className="heart heart-3">❤️</span>
                  <span className="heart heart-4">❤️</span>
                  <span className="btn-content">
                    <span className="mr-2">☕</span>
                    <span style={{fontFamily: 'Inter'}}>Buy me a coffee</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 