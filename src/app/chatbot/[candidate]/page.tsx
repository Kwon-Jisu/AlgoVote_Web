"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { nanoid } from "nanoid";
import { candidates } from "@/data/candidates";
import { ChatMessage } from "@/types";

// RAG API 호출 함수
async function fetchRagResponse(question: string, candidateInfo: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const response = await fetch(`${apiUrl}/api/question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: `${candidateInfo} ${question}`,
        match_count: 5,
      }),
    });

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("RAG API 호출 중 오류 발생:", error);
    throw error;
  }
}

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
  const [inputValue, setInputValue] = useState("");

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

  const candidateInfo = `${selectedCandidate.name} 후보(${selectedCandidate.party})의 공약에 대해 답변합니다:`;

  const handleSendMessage = async (content: string) => {
    if (!selectedCandidate || !content.trim()) return;
    
    const userMessage: ChatMessage = {
      id: nanoid(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setInputValue("");
    
    try {
      // RAG API 호출
      const response = await fetchRagResponse(content, candidateInfo);
      
      // 출처 정보 추출 (마지막 줄이 출처인 경우를 가정)
      let responseText = response;
      let source = "";
      
      const lines = response.split('\n');
      const lastLine = lines[lines.length - 1].trim();
      
      if (lastLine.startsWith('출처:') || lastLine.includes('참고:')) {
        responseText = lines.slice(0, -1).join('\n');
        source = lastLine;
      }
      
      const botMessage: ChatMessage = {
        id: nanoid(),
        role: "bot",
        content: responseText,
        timestamp: new Date(),
        candidateId: selectedCandidate.id,
        sourceDescription: source || "2022 선거 공약집",
        sourceUrl: source ? "https://example.com/policy" : undefined,
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // 오류 발생 시 오류 메시지 표시
      const errorMessage: ChatMessage = {
        id: nanoid(),
        role: "bot",
        content: "죄송합니다. 답변을 생성하는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        timestamp: new Date(),
        candidateId: selectedCandidate.id,
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      console.error("답변 생성 중 오류:", error);
    } finally {
      setIsTyping(false);
    }
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
                disabled={isTyping}
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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && inputValue.trim() && !isTyping) {
                handleSendMessage(inputValue.trim());
              }
            }}
            disabled={isTyping}
          />
          <button
            onClick={() => {
              if (inputValue.trim() && !isTyping) {
                handleSendMessage(inputValue.trim());
              }
            }}
            disabled={!inputValue.trim() || isTyping}
            className={`w-10 h-10 flex items-center justify-center text-white rounded-full ml-2 ${
              !inputValue.trim() || isTyping ? "bg-gray-400" : "bg-[#3449FF]"
            }`}
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