"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

// 세션 타입 정의
interface ChatSession {
  id: string;
  session_id: string;
  candidate_id: string;
  started_at: string;
  last_activity: string;
  message_count: number | { count: number };
  group_count?: number; // 그룹 수 추가
}

// 페이지 컴포넌트
export default function ChatHistoryPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <ChatHistoryContent />
    </Suspense>
  );
}

// 로딩 인디케이터 컴포넌트
function LoadingIndicator() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E1E1E]">대화 내역</h1>
        <p className="mt-2 text-[#6B7280]">로딩 중...</p>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <div className="inline-block w-6 h-6 border-2 border-[#3449FF] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-[#6B7280]">데이터를 불러오는 중...</p>
      </div>
    </div>
  );
}

// 실제 컨텐츠 컴포넌트
function ChatHistoryContent() {
  // 상태 관리
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalRows, setTotalRows] = useState(0); // 전체 행 수
  const [candidateFilter, setCandidateFilter] = useState("");
  const [browserSessionFilter, setBrowserSessionFilter] = useState("");
  const [isGrouped, setIsGrouped] = useState(false); // 그룹화 상태
  
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // 상수로 변경
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 세션 데이터 가져오기 함수를 useCallback으로 감싸서 의존성 문제 해결
  const fetchSessions = useCallback(async (page: number, candidateId: string, browserSessionId?: string, groupBySessions: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const offset = (page - 1) * itemsPerPage;
      let url = `/api/admin/chat-sessions?limit=${itemsPerPage}&offset=${offset}`;
      
      if (candidateId) {
        url += `&candidateId=${candidateId}`;
      }

      if (browserSessionId) {
        url += `&browserSessionId=${browserSessionId}`;
      }
      
      if (groupBySessions) {
        url += `&groupBy=session_id`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }
      
      const { data, count, total_rows, is_grouped } = await response.json();
      setSessions(data || []);
      setTotalCount(count || 0);
      setTotalRows(total_rows || count || 0); // 전체 행 수 설정
      setIsGrouped(is_grouped || false); // 그룹화 여부 설정
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "데이터를 불러오는 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("세션 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]); // itemsPerPage 의존성 추가
  
  // 초기 로드
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const candidateId = searchParams.get("candidateId") || "";
    const browserSessionId = searchParams.get("browserSessionId") || "";
    const groupBySessions = searchParams.get("grouped") === "true";
    
    setCurrentPage(page);
    setCandidateFilter(candidateId);
    setBrowserSessionFilter(browserSessionId);
    setIsGrouped(groupBySessions);
    
    fetchSessions(page, candidateId, browserSessionId, groupBySessions);
  }, [searchParams, fetchSessions]); // fetchSessions 의존성 추가
  
  // 필터 변경 핸들러
  const handleFilterChange = (candidateId: string) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    
    if (candidateId) {
      params.set("candidateId", candidateId);
    }
    
    if (isGrouped) {
      params.set("grouped", "true");
    }
    
    router.push(`/admin/chat-history?${params.toString()}`);
  };

  // 그룹화 변경 핸들러
  const handleToggleGrouping = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    
    if (!isGrouped) {
      params.set("grouped", "true");
    } else {
      params.delete("grouped");
    }
    
    router.push(`/admin/chat-history?${params.toString()}`);
  };

  // 브라우저 세션 필터 초기화
  const clearBrowserSessionFilter = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    
    if (candidateFilter) {
      params.set("candidateId", candidateFilter);
    }
    
    if (isGrouped) {
      params.set("grouped", "true");
    }
    
    router.push(`/admin/chat-history?${params.toString()}`);
  };
  
  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    
    router.push(`/admin/chat-history?${params.toString()}`);
  };
  
  // 시간 포맷팅 함수
  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ko });
    } catch (error) {
      console.error("날짜 형식 변환 오류:", error);
      return dateStr;
    }
  };

  // 브라우저 세션 ID를 더 잘 표시하는 함수
  const formatSessionId = (sessionId: string) => {
    if (!sessionId) return "미지정";
    if (sessionId.length <= 8) return sessionId;
    
    return `${sessionId.substring(0, 8)}...`;
  };
  
  // 페이지 UI 렌더링
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E1E1E]">대화 내역</h1>
        <p className="mt-2 text-[#6B7280]">
          사용자와 챗봇의 대화 내역을 조회합니다.
          {totalRows > 0 && (
            <span className="ml-2">
              (전체 <span className="font-semibold text-[#3449FF]">{totalRows}</span>개 세션)
            </span>
          )}
        </p>
      </div>
      
      {/* 필터 섹션 */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {browserSessionFilter ? (
            <div className="w-full">
              <div className="bg-[#F0F4FF] p-3 rounded-md flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-[#1E1E1E] mr-2">브라우저 세션 ID 필터:</span>
                  <span className="font-mono text-[#3449FF]">{browserSessionFilter}</span>
                </div>
                <button
                  onClick={clearBrowserSessionFilter}
                  className="text-[#6B7280] hover:text-[#1E1E1E] p-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full sm:w-64">
                <label className="block text-sm text-[#6B7280] mb-1">후보자 필터</label>
                <select
                  className="w-full border border-[#E5E7EB] rounded-md px-3 py-2"
                  value={candidateFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                >
                  <option value="">모든 후보자</option>
                  <option value="lee-jaemyung">이재명</option>
                  <option value="kim-moonsoo">김문수</option>
                  <option value="lee-junseok">이준석</option>
                </select>
              </div>
              
              <div className="w-full sm:w-auto sm:ml-auto self-end">
                <div className="flex gap-2">
                  <button
                    className={`py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors border ${
                      isGrouped
                        ? "bg-[#3449FF] text-white border-[#3449FF]"
                        : "bg-white text-[#6B7280] border-[#E5E7EB]"
                    }`}
                    onClick={handleToggleGrouping}
                  >
                    {isGrouped ? "개별 세션 보기" : "세션 ID로 그룹화"}
                  </button>
                  
                  <button
                    className="bg-[#3449FF] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
                    onClick={() => fetchSessions(currentPage, candidateFilter, browserSessionFilter, isGrouped)}
                  >
                    새로고침
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* 데이터 테이블 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-[#3449FF] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-[#6B7280]">대화 내역을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-[#EF4444]">
            <p>{error}</p>
            <button
              className="mt-4 text-[#3449FF] hover:underline"
              onClick={() => fetchSessions(currentPage, candidateFilter, browserSessionFilter, isGrouped)}
            >
              다시 시도
            </button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-8 text-center text-[#6B7280]">
            <p>대화 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F7FA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">브라우저 세션 ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">후보자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">메시지 수</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">대화 그룹</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">시작 시간</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">마지막 활동</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-[#F5F7FA]">
                    <td className="px-6 py-4 text-sm text-[#1E1E1E] font-mono">
                      {formatSessionId(session.session_id)}
                      <span 
                        className="ml-2 cursor-pointer text-primary" 
                        title={`전체 세션 ID: ${session.session_id}`}
                      >
                        ℹ️
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1E1E1E]">{session.candidate_id || "미지정"}</td>
                    <td className="px-6 py-4 text-sm text-[#1E1E1E]">
                      {typeof session.message_count === 'object' && session.message_count !== null
                        ? (session.message_count.count || 0)
                        : (session.message_count || 0)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1E1E1E]">
                      {session.group_count && session.group_count > 1 ? (
                        <Link 
                          href={`/admin/chat-history?browserSessionId=${session.session_id}`}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#3449FF] text-white"
                        >
                          {session.group_count}개 대화
                        </Link>
                      ) : (
                        "1개 대화"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B7280]">{formatTime(session.started_at)}</td>
                    <td className="px-6 py-4 text-sm text-[#6B7280]">{formatTime(session.last_activity)}</td>
                    <td className="px-6 py-4 text-sm text-[#3449FF]">
                      <Link href={`/admin/chat-history/${session.id}`} className="hover:underline">
                        대화 보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* 페이지네이션 */}
        {!loading && !error && sessions.length > 0 && !browserSessionFilter && (
          <div className="px-6 py-4 bg-[#F5F7FA] border-t border-[#E5E7EB] flex items-center justify-between">
            <div className="text-sm text-[#6B7280]">
              {isGrouped ? (
                <>총 {totalCount}개 그룹 중 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCount)}</>
              ) : (
                <>총 {totalCount}개 세션 중 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCount)}</>
              )}
              {totalRows > totalCount && (
                <span className="ml-2">(전체 {totalRows}개 세션)</span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-[#F5F7FA] text-[#6B7280] cursor-not-allowed"
                    : "bg-white text-[#3449FF] hover:bg-[#F0F4FF]"
                }`}
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  currentPage * itemsPerPage >= totalCount
                    ? "bg-[#F5F7FA] text-[#6B7280] cursor-not-allowed"
                    : "bg-white text-[#3449FF] hover:bg-[#F0F4FF]"
                }`}
                onClick={() => 
                  currentPage * itemsPerPage < totalCount && 
                  handlePageChange(currentPage + 1)
                }
                disabled={currentPage * itemsPerPage >= totalCount}
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 