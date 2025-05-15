"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

// 타입 정의
interface SourceMetadata {
  page?: number;
  source?: string;
  creationDate?: string;
  source_name?: string;
  source_link?: string;
  candidate?: string;
}

interface ChatMessage {
  id: number;
  chat_session_id: string;
  role: string;
  content: string;
  timestamp: string;
  message_order: number;
  source_description: string | null;
  source_url: string | null;
  source_metadata: SourceMetadata | null;
}

interface ChatSession {
  id: string;
  session_id: string;
  candidate_id: string;
  started_at: string;
  last_activity: string;
}

// 페이지 컴포넌트
export default function ChatSessionDetailPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <ChatSessionContent />
    </Suspense>
  );
}

// 로딩 인디케이터 컴포넌트
function LoadingIndicator() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1E1E1E]">대화 상세 내역</h1>
          <p className="mt-2 text-[#6B7280]">로딩 중...</p>
        </div>
        <Link
          href="/admin/chat-history"
          className="bg-white border border-[#E5E7EB] text-[#6B7280] py-2 px-4 rounded-md hover:bg-[#F5F7FA] transition-colors"
        >
          목록으로 돌아가기
        </Link>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <div className="inline-block w-6 h-6 border-2 border-[#3449FF] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-[#6B7280]">데이터를 불러오는 중...</p>
      </div>
    </div>
  );
}

// 실제 컨텐츠 컴포넌트
function ChatSessionContent() {
  // 상태 관리
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [relatedSessions, setRelatedSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 세션 정보 가져오기
  const fetchSession = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch(`/api/admin/chat-sessions?sessionId=${sessionId}`);
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }
      
      const { data } = await response.json();
      
      if (data && data.length > 0) {
        setSession(data[0]);
      } else {
        throw new Error("세션을 찾을 수 없습니다.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "세션 정보를 불러오는 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("세션 데이터 로드 실패:", error);
    }
  }, []);
  
  // 관련 세션 가져오기 - useCallback으로 감싸기
  const fetchRelatedSessions = useCallback(async (browserSessionId: string) => {
    try {
      const response = await fetch(`/api/admin/chat-sessions?browserSessionId=${browserSessionId}`);
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }
      
      const { data } = await response.json();
      
      // 현재 세션을 제외한 다른 세션들만 표시
      const filteredSessions = data.filter((s: ChatSession) => s.id !== params.id);
      setRelatedSessions(filteredSessions);
    } catch (error) {
      console.error("관련 세션 데이터 로드 실패:", error);
      // 관련 세션 로드 실패는 치명적이지 않으므로 에러 상태를 설정하지 않습니다.
    }
  }, [params.id]);
  
  // 메시지 목록 가져오기
  const fetchMessages = useCallback(async (sessionId: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/admin/chat-messages?sessionId=${sessionId}`);
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }
      
      const { data } = await response.json();
      setMessages(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "메시지를 불러오는 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("메시지 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (params.id) {
      fetchSession(params.id);
      fetchMessages(params.id);
    }
  }, [params.id, fetchMessages, fetchSession]);
  
  // 같은 브라우저 세션에 속한 다른 세션들 가져오기
  useEffect(() => {
    if (session && session.session_id) {
      fetchRelatedSessions(session.session_id);
    }
  }, [session, fetchRelatedSessions]);
  
  // 스크롤 자동 이동
  useEffect(() => {
    if (messagesEndRef.current && !loading) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);
  
  // 다른 세션으로 이동하기
  const navigateToSession = (sessionId: string) => {
    router.push(`/admin/chat-history/${sessionId}`);
  };
  
  // 시간 포맷팅 함수
  const formatTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "yyyy.MM.dd HH:mm:ss", { locale: ko });
    } catch (error) {
      console.error("날짜 형식 변환 오류:", error);
      return dateStr;
    }
  };
  
  // 메시지 역할에 따른 스타일 지정
  const getMessageStyle = (role: string) => {
    if (role === "user") {
      return {
        containerClass: "flex justify-end mb-4",
        bubbleClass: "bg-[#3449FF] text-white rounded-xl p-3 max-w-[80%]"
      };
    } else {
      return {
        containerClass: "flex mb-4",
        bubbleClass: "bg-[#F0F4FF] text-[#1E1E1E] rounded-xl p-3 max-w-[80%]"
      };
    }
  };
  
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1E1E1E]">대화 상세 내역</h1>
          <p className="mt-2 text-[#6B7280]">
            대화 ID: {params.id}
          </p>
        </div>
        <div className="flex gap-2">
          {session && session.session_id && (
            <Link
              href={`/admin/chat-history?browserSessionId=${session.session_id}`}
              className="bg-[#F0F4FF] border border-[#3449FF] text-[#3449FF] py-2 px-4 rounded-md hover:bg-[#E4EAFF] transition-colors"
            >
              이 사용자의 모든 대화 보기
            </Link>
          )}
          <Link
            href="/admin/chat-history"
            className="bg-white border border-[#E5E7EB] text-[#6B7280] py-2 px-4 rounded-md hover:bg-[#F5F7FA] transition-colors"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
      
      {/* 세션 정보 */}
      {session && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-[#6B7280]">세션 ID</h3>
              <p className="font-mono">{session.session_id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#6B7280]">후보자</h3>
              <p>{session.candidate_id || "미지정"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#6B7280]">시작 시간</h3>
              <p>{formatTime(session.started_at)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#6B7280]">마지막 활동</h3>
              <p>{formatTime(session.last_activity)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 관련 세션 */}
      {relatedSessions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">같은 사용자의 다른 대화 세션</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F7FA]">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[#6B7280]">후보자</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[#6B7280]">시작 시간</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[#6B7280]">마지막 활동</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[#6B7280]">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {relatedSessions.map((relatedSession) => (
                  <tr 
                    key={relatedSession.id} 
                    className="hover:bg-[#F5F7FA] cursor-pointer"
                    onClick={() => navigateToSession(relatedSession.id)}
                  >
                    <td className="px-4 py-2 text-sm">{relatedSession.candidate_id || "미지정"}</td>
                    <td className="px-4 py-2 text-sm text-[#6B7280]">{formatTime(relatedSession.started_at)}</td>
                    <td className="px-4 py-2 text-sm text-[#6B7280]">{formatTime(relatedSession.last_activity)}</td>
                    <td className="px-4 py-2 text-sm text-[#3449FF]">
                      <button className="hover:underline">대화 보기</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* 대화 내용 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">대화 내용</h2>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-[#3449FF] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-[#6B7280]">메시지를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-[#EF4444]">
            <p>{error}</p>
            <button
              className="mt-4 text-[#3449FF] hover:underline"
              onClick={() => params.id && fetchMessages(params.id)}
            >
              다시 시도
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-[#6B7280]">
            <p>대화 내용이 없습니다.</p>
          </div>
        ) : (
          <div className="chat-container max-h-[600px] overflow-y-auto p-4 bg-[#F5F7FA] rounded-lg">
            {messages.map((message) => {
              const { containerClass, bubbleClass } = getMessageStyle(message.role);
              
              return (
                <div key={message.id} className={containerClass}>
                  {message.role === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-[#3449FF] text-white flex items-center justify-center mr-2 flex-shrink-0">
                      AI
                    </div>
                  )}
                  <div className="message-content">
                    <div className={bubbleClass}>
                      {message.role === "user" ? (
                        <p className="whitespace-pre-line">{message.content}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-[#1E1E1E] prose-p:text-[#1E1E1E] prose-strong:text-[#1E1E1E] prose-strong:font-bold prose-ul:text-[#1E1E1E] prose-ol:text-[#1E1E1E]">
                          <ReactMarkdown>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-[#6B7280] mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                    
                    {message.role === "bot" && message.source_description && (
                      <div className="mt-1 bg-white bg-opacity-50 p-2 rounded text-xs">
                        <p className="text-[#6B7280] flex items-center">
                          <span className="mr-1">📄</span>
                          출처: {message.source_url ? (
                            <a
                              href={message.source_url}
                              className="text-[#3449FF] underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {message.source_description}
                            </a>
                          ) : (
                            <span>{message.source_description}</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
} 