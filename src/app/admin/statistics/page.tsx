"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// 세션 타입 정의
interface ChatSession {
  id: string;
  session_id: string;
  candidate_id: string;
  started_at: string;
  last_activity: string;
  message_count: number | { count: number };
}

interface StatData {
  totalSessions: number;
  totalMessages: number;
  avgMessagesPerSession: number;
  sessionsPerCandidate: Record<string, number>;
  messagesPerCandidate: Record<string, number>;
  activeHours: Record<string, number>;
  recentActiveDays: { date: string; sessions: number }[];
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchStatistics();
  }, []);
  
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Supabase에서 대화 데이터를 가져와서 통계 계산
      const sessionsResponse = await fetch('/api/admin/chat-sessions');
      
      if (!sessionsResponse.ok) {
        throw new Error(`API 요청 실패: ${sessionsResponse.status}`);
      }
      
      const { data: sessions } = await sessionsResponse.json();
      
      if (!sessions || !Array.isArray(sessions)) {
        throw new Error("세션 데이터를 불러올 수 없습니다.");
      }
      
      // Sessions 배열을 ChatSession 타입으로 처리
      const chatSessions = sessions as ChatSession[];
      
      // 후보자별 세션 수
      const sessionsPerCandidate: Record<string, number> = {};
      const messagesPerCandidate: Record<string, number> = {};
      const activeHours: Record<string, number> = {};
      const activeDaysMap: Record<string, number> = {};
      
      let totalMessages = 0;
      
      chatSessions.forEach((session) => {
        // 후보자별 세션 수
        const candidateId = session.candidate_id || '알 수 없음';
        sessionsPerCandidate[candidateId] = (sessionsPerCandidate[candidateId] || 0) + 1;
        
        // 메시지 수 - message_count가 객체일 수 있으므로 값을 추출
        // Supabase에서 count()를 사용하면 {count: 숫자} 형태의 객체가 반환될 수 있음
        const messageCount = typeof session.message_count === 'object' && session.message_count !== null 
          ? (session.message_count.count || 0) 
          : (session.message_count || 0);
        
        totalMessages += messageCount;
        
        // 후보자별 메시지 수
        messagesPerCandidate[candidateId] = (messagesPerCandidate[candidateId] || 0) + messageCount;
        
        // 시간대별 활동
        try {
          const hour = new Date(session.last_activity).getHours();
          activeHours[hour] = (activeHours[hour] || 0) + 1;
          
          // 일자별 활동
          const dateStr = format(new Date(session.last_activity), 'yyyy-MM-dd', { locale: ko }); // ko 로케일 사용
          activeDaysMap[dateStr] = (activeDaysMap[dateStr] || 0) + 1;
        } catch (e) {
          console.error("날짜 파싱 오류:", e);
        }
      });
      
      // 최근 7일간 활동
      const recentActiveDays = Object.entries(activeDaysMap)
        .map(([date, sessions]) => ({ date, sessions }))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 7)
        .reverse();
      
      // 평균 계산
      const avgMessagesPerSession = sessions.length 
        ? Number((totalMessages / sessions.length).toFixed(1)) 
        : 0;
      
      setStats({
        totalSessions: sessions.length,
        totalMessages,
        avgMessagesPerSession,
        sessionsPerCandidate,
        messagesPerCandidate,
        activeHours,
        recentActiveDays
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "통계 데이터를 불러오는 중 오류가 발생했습니다.");
      console.error("통계 데이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // 후보자 ID를 이름으로 변환
  const getCandidateName = (id: string) => {
    const candidateMap: Record<string, string> = {
      "yoon": "윤석열",
      "lee": "이재명",
      "ahn": "안철수",
      "sim": "심상정",
      "알 수 없음": "알 수 없음"
    };
    
    return candidateMap[id] || id;
  };
  
  // 차트 최대값 찾기
  const findMaxValue = (obj: Record<string, number>) => {
    return Math.max(...Object.values(obj), 0);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E1E1E]">서비스 통계</h1>
        <p className="mt-2 text-[#6B7280]">
          챗봇 대화 데이터 통계를 확인합니다.
        </p>
      </div>
      
      {loading ? (
        <div className="p-8 text-center bg-white rounded-lg shadow-sm">
          <div className="inline-block w-6 h-6 border-2 border-[#3449FF] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-[#6B7280]">통계 데이터를 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-lg shadow-sm">
          <p className="text-[#EF4444]">{error}</p>
          <button
            className="mt-4 text-[#3449FF] hover:underline"
            onClick={fetchStatistics}
          >
            다시 시도
          </button>
        </div>
      ) : stats ? (
        <>
          {/* 요약 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-sm font-medium text-[#6B7280] uppercase">총 대화 세션</h2>
              <p className="mt-2 text-3xl font-bold text-[#1E1E1E]">{stats.totalSessions}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-sm font-medium text-[#6B7280] uppercase">총 메시지 수</h2>
              <p className="mt-2 text-3xl font-bold text-[#1E1E1E]">{stats.totalMessages}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-sm font-medium text-[#6B7280] uppercase">세션당 평균 메시지</h2>
              <p className="mt-2 text-3xl font-bold text-[#1E1E1E]">{stats.avgMessagesPerSession}</p>
            </div>
          </div>
          
          {/* 후보자별 통계 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">후보자별 통계</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 후보자별 세션 수 */}
              <div>
                <h3 className="text-sm font-medium text-[#6B7280] mb-4">세션 수</h3>
                <div className="space-y-3">
                  {Object.entries(stats.sessionsPerCandidate).map(([candidateId, count]) => {
                    const maxValue = findMaxValue(stats.sessionsPerCandidate);
                    const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
                    
                    return (
                      <div key={candidateId}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{getCandidateName(candidateId)}</span>
                          <span>{count}</span>
                        </div>
                        <div className="w-full bg-[#F5F7FA] rounded-full h-2">
                          <div 
                            className="bg-[#3449FF] h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* 후보자별 메시지 수 */}
              <div>
                <h3 className="text-sm font-medium text-[#6B7280] mb-4">메시지 수</h3>
                <div className="space-y-3">
                  {Object.entries(stats.messagesPerCandidate).map(([candidateId, count]) => {
                    const maxValue = findMaxValue(stats.messagesPerCandidate);
                    const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
                    
                    return (
                      <div key={candidateId}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{getCandidateName(candidateId)}</span>
                          <span>{count}</span>
                        </div>
                        <div className="w-full bg-[#F5F7FA] rounded-full h-2">
                          <div 
                            className="bg-[#3449FF] h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* 시간대별 활동 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">시간대별 활동</h2>
            
            <div className="h-[200px] flex items-end space-x-2">
              {Array.from({ length: 24 }).map((_, hour) => {
                const count = stats.activeHours[hour] || 0;
                const maxValue = findMaxValue(stats.activeHours);
                const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
                
                return (
                  <div 
                    key={hour} 
                    className="flex-1 flex flex-col items-center group"
                  >
                    <div className="relative w-full">
                      <div 
                        className="bg-[#3449FF] hover:bg-[#5C6CFF] transition-colors w-full rounded-t"
                        style={{ height: `${percentage}%` }}
                      ></div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mb-1">
                        {count}건
                      </div>
                    </div>
                    <div className="text-xs text-[#6B7280] mt-1">{hour}시</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* 최근 활동 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">최근 활동 추이</h2>
            
            {stats.recentActiveDays.length > 0 ? (
              <div className="h-[200px] flex items-end space-x-4">
                {stats.recentActiveDays.map((day) => {
                  const maxValue = Math.max(...stats.recentActiveDays.map(d => d.sessions));
                  const percentage = maxValue > 0 ? (day.sessions / maxValue) * 100 : 0;
                  
                  return (
                    <div 
                      key={day.date} 
                      className="flex-1 flex flex-col items-center group"
                    >
                      <div className="relative w-full">
                        <div 
                          className="bg-[#3449FF] hover:bg-[#5C6CFF] transition-colors w-full rounded-t"
                          style={{ height: `${percentage}%` }}
                        ></div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mb-1">
                          {day.sessions}건
                        </div>
                      </div>
                      <div className="text-xs text-[#6B7280] mt-1">
                        {format(new Date(day.date), 'MM/dd', { locale: ko })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-[#6B7280]">최근 활동 데이터가 없습니다.</p>
            )}
          </div>
        </>
      ) : (
        <div className="p-8 text-center bg-white rounded-lg shadow-sm">
          <p className="text-[#6B7280]">통계 데이터를 불러올 수 없습니다.</p>
        </div>
      )}
    </div>
  );
} 