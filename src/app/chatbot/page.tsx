'use client';

import { useState } from 'react';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { candidates } from '@/data/candidates';
import { ChatMessage } from '@/types';
import { useRouter } from 'next/navigation';

export default function ChatbotPage() {
  const [step, setStep] = useState<'selection' | 'chat'>('selection');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  const handleSelectCandidate = (candidateId: string) => {
    router.push(`/chatbot/${candidateId}`);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedCandidateId) {
      return;
    }

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: nanoid(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // 챗봇 응답 시뮬레이션 (실제 API 연동 전 테스트용)
    setTimeout(() => {
      // 랜덤 응답 생성 (실제로는 RAG 기반 응답이 필요함)
      const responses = [
        {
          text: `${content}에 대한 제 정책은 다음과 같습니다:`,
          policies: [
            "청년 주거 안정을 위한 20만호 공급",
            "청년 기본소득 30만원 지급",
            "대학 등록금 부담 경감"
          ],
          source: "2022 대선 공약집 23-25페이지",
          sourceUrl: "https://example.com/policy/youth"
        },
        {
          text: "그 문제에 대해 저는 다음과 같은 해결책을 제시합니다:",
          policies: [
            "중소기업 디지털 전환 지원 확대",
            "지역 균형 발전을 위한 인프라 구축",
            "공정 경쟁 환경 조성"
          ],
          source: "2022 경제정책 백서 42-45페이지",
          sourceUrl: "https://example.com/policy/economy"
        },
        {
          text: "해당 이슈에 대한 제 입장은 다음과 같습니다:",
          policies: [
            "노인 돌봄 서비스 확충",
            "어르신 의료비 부담 경감",
            "노인 일자리 확대"
          ],
          source: "2022 복지정책 공약집 15-18페이지",
          sourceUrl: "https://example.com/policy/welfare"
        }
      ];

      const response = responses[Math.floor(Math.random() * responses.length)];
      
      // 정책 리스트를 문자열로 변환
      const policiesText = response.policies.map(p => `• ${p}`).join('\n');
      
      const botMessage: ChatMessage = {
        id: nanoid(),
        role: 'bot',
        content: `${response.text}\n\n${policiesText}`,
        timestamp: new Date(),
        candidateId: selectedCandidateId,
        sourceDescription: response.source,
        sourceUrl: response.sourceUrl
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleBackToSelection = () => {
    setStep('selection');
    setMessages([]);
    setSelectedCandidateId(null);
  };

  const selectedCandidate = selectedCandidateId
    ? candidates.find((c) => c.id === selectedCandidateId)
    : null;

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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