"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { nanoid } from "nanoid";
import { candidates } from "@/data/candidates";
import { ChatMessage } from "@/types";

export default function ChatbotCandidatePage() {
  const { candidate } = useParams<{ candidate: string }>();
  const router = useRouter();
  const selectedCandidate = candidates.find((c) => c.id === candidate);

  const [messages, setMessages] = useState<ChatMessage[]>(
    selectedCandidate
      ? [
          {
            id: nanoid(),
            role: "bot",
            content: `안녕하세요, ${selectedCandidate.name}입니다. 제 정책에 대해 어떤 것이 궁금하신가요?`,
            timestamp: new Date(),
            candidateId: selectedCandidate.id,
          },
        ]
      : []
  );
  const [isTyping, setIsTyping] = useState(false);

  if (!selectedCandidate) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">존재하지 않는 후보입니다</h2>
          <button
            className="mt-4 px-4 py-2 bg-[#3449FF] text-white rounded-lg"
            onClick={() => router.push("/chatbot")}
          >
            후보자 목록으로 돌아가기
          </button>
        </div>
      </main>
    );
  }

  const handleSendMessage = (content: string) => {
    if (!selectedCandidate) return;
    const userMessage: ChatMessage = {
      id: nanoid(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        {
          text: `${content}에 대한 제 정책은 다음과 같습니다:`,
          policies: [
            "청년 주거 안정을 위한 20만호 공급",
            "청년 기본소득 30만원 지급",
            "대학 등록금 부담 경감",
          ],
          source: "2022 대선 공약집 23-25페이지",
          sourceUrl: "https://example.com/policy/youth",
        },
        {
          text: "그 문제에 대해 저는 다음과 같은 해결책을 제시합니다:",
          policies: [
            "중소기업 디지털 전환 지원 확대",
            "지역 균형 발전을 위한 인프라 구축",
            "공정 경쟁 환경 조성",
          ],
          source: "2022 경제정책 백서 42-45페이지",
          sourceUrl: "https://example.com/policy/economy",
        },
        {
          text: "해당 이슈에 대한 제 입장은 다음과 같습니다:",
          policies: [
            "노인 돌봄 서비스 확충",
            "어르신 의료비 부담 경감",
            "노인 일자리 확대",
          ],
          source: "2022 복지정책 공약집 15-18페이지",
          sourceUrl: "https://example.com/policy/welfare",
        },
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      const policiesText = response.policies.map((p) => `• ${p}`).join("\n");
      const botMessage: ChatMessage = {
        id: nanoid(),
        role: "bot",
        content: `${response.text}\n\n${policiesText}`,
        timestamp: new Date(),
        candidateId: selectedCandidate.id,
        sourceDescription: response.source,
        sourceUrl: response.sourceUrl,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <main className="h-screen flex flex-col bg-[#F5F7FA]">
      <div className="bg-white shadow-sm py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 relative">
              <Image
                src={selectedCandidate.profileImage}
                alt={selectedCandidate.name}
                className="object-cover object-top"
                fill
              />
            </div>
            <div>
              <h2 className="text-lg font-bold">{selectedCandidate.name}</h2>
              <p className="text-sm text-[#6B7280]">{selectedCandidate.party}</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/chatbot")}
            className="w-10 h-10 flex items-center justify-center text-[#6B7280]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>
      </div>
      <div className="chat-container flex-1 container mx-auto px-4 py-4 overflow-hidden flex flex-col">
        <div className="chat-messages flex-1 overflow-y-auto pb-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex mb-4 ${message.role === "user" ? "justify-end" : ""}`}>
              {message.role === "bot" && (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 relative">
                  <Image
                    src={selectedCandidate.profileImage}
                    alt={selectedCandidate.name}
                    className="object-cover object-top"
                    fill
                  />
                </div>
              )}
              <div
                className={`message-bubble ${
                  message.role === "user"
                    ? "bg-[#3449FF] text-white"
                    : "bg-[#F0F4FF] text-[#1E1E1E]"
                } rounded-xl p-3 max-w-[80%]`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
                {message.role === "bot" && message.sourceDescription && (
                  <div className="mt-2 bg-white bg-opacity-50 p-2 rounded text-xs">
                    <p className="text-[#6B7280]">
                      출처: {message.sourceUrl ? (
                        <a
                          href={message.sourceUrl}
                          className="text-[#3449FF] underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {message.sourceDescription}
                        </a>
                      ) : (
                        message.sourceDescription
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 relative">
                <Image
                  src={selectedCandidate.profileImage}
                  alt={selectedCandidate.name}
                  className="object-cover object-top"
                  fill
                />
              </div>
              <div className="message-bubble bg-[#F0F4FF] rounded-xl p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-[#6B7280] animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* 예시 질문 버튼 영역 */}
        <div className="flex justify-center">
          <div className="flex flex-wrap gap-2 mb-3 justify-center">
            {["청년 일자리 정책이 궁금해요", "주거 지원 방안 알려주세요", "노인 복지 공약 설명해 주세요", "경제 성장 전략이 뭔가요?"].map((example) => (
              <button
                key={example}
                type="button"
                className="bg-[#F0F4FF] text-[#3449FF] rounded-full px-6 py-3 text-base font-medium hover:bg-[#3449FF] hover:text-white transition-colors border border-[#3449FF] min-w-[140px] min-h-[48px]"
                onClick={() => handleSendMessage(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
        {/* 챗봇 주의사항 */}
        <div className="chat-status mb-2">
          <p className="text-xs text-[#6B7280] mt-1">
            ※ 이 챗봇은 각 후보의 공식 공약에 기반한 응답을 제공하며, 정보 정확성을 위해 검수되었습니다.
          </p>
        </div>
        <div className="chat-input-container mt-2 bg-white rounded-lg shadow-sm p-2 flex items-center">
          <input
            type="text"
            className="flex-1 py-2 px-3 text-[#1E1E1E] border-none focus:outline-none"
            placeholder="정책에 대해 궁금한 점을 물어보세요"
            onKeyPress={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                handleSendMessage(e.currentTarget.value.trim());
                e.currentTarget.value = "";
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
              if (input.value.trim()) {
                handleSendMessage(input.value.trim());
                input.value = "";
              }
            }}
            className="w-10 h-10 flex items-center justify-center text-white bg-[#3449FF] rounded-full ml-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
} 