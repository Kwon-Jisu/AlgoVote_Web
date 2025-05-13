'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { candidates } from '@/data/candidates';

export default function ChatbotPage() {
  const router = useRouter();

  const handleSelectCandidate = (candidateId: string) => {
    router.push(`/chatbot/${candidateId}`);
  };

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div id="step1" className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-4">21대 대선 후보자 목록</h1>
        <p className="text-center text-text-secondary mb-4">
          대선 후보자에게 궁금한 것을 직접 물어보세요!
        </p>
        <div className="bg-[#3449FF]/5 outline outline-[3px] outline-[#3449ff] text-primary p-4 rounded-xl mb-8">
          <p className="text-center text-sm ">
            이 챗봇은 객관적 자료 기반의 RAG 챗봇입니다.<br/>
            후보자와 직접 대화하는 느낌으로 정책과 비전에 대해 상세히 질문해보세요!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer border border-[#E5E7EB]"
              onClick={() => handleSelectCandidate(candidate.id)}
            >
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden relative mr-4 flex-shrink-0">
                  <Image
                    src={candidate.profileImage}
                    alt={candidate.name}
                    className="object-cover object-top"
                    fill
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{candidate.name}</h3>
                  <p className="text-sm text-[#6B7280] mb-1">&ldquo;{candidate.slogan}&rdquo;</p>
                  <p className="text-xs text-[#6B7280]">{candidate.party}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 