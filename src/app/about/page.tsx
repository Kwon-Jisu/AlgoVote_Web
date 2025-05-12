import React from 'react';
import Image from 'next/image';
import { TeamMember } from '@/types';

// Mock team members data (will be replaced with Supabase data later)
const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Dino',
    role: '기획 · 디자인 · 개발',
    quote: '혼란 속에서도 스스로 선택할 수 있도록.',
    image: ''
  },
  {
    id: '2',
    name: 'Uri',
    role: '데이터 리서치 · 정책 분석',
    quote: '정확한 정보가 좋은 선택을 만듭니다.',
    image: ''
  },
  {
    id: '3',
    name: 'Mina',
    role: 'UX/UI 디자이너',
    quote: '공약을 쉽고 명확하게 전달하고 싶었습니다.',
    image: ''
  }
];

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <main className="pt-24 pb-16">
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
              ‘이 사람이 어떤 정책을 내세우는지’보다, ‘그냥 괜찮아 보이니까’가 기준이 되곤 했습니다.<br></br>
              정책과 비전을 직접 비교하며 판단할 수 있다면, 더 나은 선택이 가능하지 않을까.그 물음에서 ‘알고투표’는 시작됐습니다.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              정치적 중립성과 객관성을 바탕으로, 누구나 공약을 비교하고 판단할 수 있도록 돕는 것.<br></br>
              그것이 우리가 생각하는 더 나은 민주주의의 출발점입니다.
            </p>
          </div>
        </section>

        {/* 제작진 소개 섹션 */}
        <section className="container mx-auto px-4 md:px-6 py-12 md:py-16 fade-in">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center md:text-left">제작진 소개</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {teamMembers.map(member => (
              <div key={member.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full overflow-hidden">
                    {member.image ? (
                      <Image 
                        src={member.image} 
                        alt={member.name} 
                        width={48} 
                        height={48} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <i className="ri-user-smile-line ri-lg text-text-secondary"></i>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-lg text-text-primary">{member.name}</h3>
                    <p className="text-text-secondary">{member.role}</p>
                  </div>
                </div>
                <p className="text-text-secondary italic">&quot;{member.quote}&quot;</p>
              </div>
            ))}
          </div>
        </section>

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