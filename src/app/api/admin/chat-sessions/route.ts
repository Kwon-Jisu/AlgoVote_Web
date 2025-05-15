import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { ChatSession } from "@/lib/supabase/service";

// 브라우저 세션 그룹을 위한 인터페이스
interface SessionGroup {
  [key: string]: ChatSession[];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get("candidateId");
    const sessionId = searchParams.get("sessionId");
    const browserSessionId = searchParams.get("browserSessionId");
    const groupBy = searchParams.get("groupBy"); // 그룹화 기준 (브라우저 세션 ID 기준은 'session_id')
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    
    // 쿼리 시작
    let query = supabase
      .from("chat_sessions")
      .select(`
        *,
        message_count:chat_messages!chat_session_id(count)
      `);

    // 브라우저 세션 ID로 조회하는 경우 (같은 사용자의 모든 대화 세션 조회)
    if (browserSessionId) {
      query = query.eq("session_id", browserSessionId);
    }
    
    // 특정 세션 ID로 조회하는 경우
    else if (sessionId) {
      query = query.eq("id", sessionId);
    }
    
    // 후보자 ID로 필터링
    if (candidateId) {
      query = query.eq("candidate_id", candidateId);
    }
    
    // 정렬 및 페이징 처리 (브라우저 세션 ID로 조회하는 경우에는 정렬만 적용)
    query = query.order("last_activity", { ascending: false });
    
    if (!browserSessionId) {
      query = query.range(offset, offset + limit - 1);
    }
    
    // 쿼리 실행
    const { data, error, count } = await query;
    
    if (error) {
      console.error("채팅 세션 조회 오류:", error);
      return NextResponse.json(
        { error: "채팅 세션 조회 실패", details: error.message },
        { status: 500 }
      );
    }
    
    // 브라우저 세션 ID로 그룹화 (groupBy=session_id 파라미터가 있을 때만)
    let result = data;
    const shouldGroupBySessionId = groupBy === 'session_id' && !browserSessionId && !sessionId;
    
    if (shouldGroupBySessionId) {
      // 브라우저 세션 ID를 기준으로 그룹화
      const groupedSessions = groupSessionsByBrowserSessionId(data);
      result = groupedSessions;
    } else {
      // 그룹화하지 않고 그룹 정보 추가
      result = addGroupCountInfo(data);
    }
    
    return NextResponse.json({
      data: result,
      count: count || result.length,
      limit,
      offset,
      total_rows: count, // 전체 행 수 추가
      is_grouped: shouldGroupBySessionId // 그룹화 여부 정보 추가
    });
  } catch (error) {
    console.error("채팅 세션 조회 중 오류:", error);
    return NextResponse.json(
      { error: "서버 오류", details: error instanceof Error ? error.message : "알 수 없는 오류" },
      { status: 500 }
    );
  }
}

// 각 세션의 그룹 정보를 추가하는 함수 (그룹화하지 않을 때 사용)
function addGroupCountInfo(sessions: ChatSession[]): ChatSession[] {
  // session_id를 기준으로 그룹별 개수 계산
  const sessionCounts: Record<string, number> = {};
  
  sessions.forEach(session => {
    const browserSessionId = session.session_id;
    sessionCounts[browserSessionId] = (sessionCounts[browserSessionId] || 0) + 1;
  });
  
  // 각 세션에 그룹 개수 정보 추가
  return sessions.map(session => {
    return {
      ...session,
      group_count: sessionCounts[session.session_id] || 1
    };
  });
}

// 브라우저 세션 ID를 기준으로 세션을 그룹화하는 함수
function groupSessionsByBrowserSessionId(sessions: ChatSession[]): ChatSession[] {
  // session_id가 브라우저 세션 ID입니다
  const sessionGroups: SessionGroup = {};
  
  // 첫번째 단계: session_id로 그룹화
  sessions.forEach(session => {
    const browserSessionId = session.session_id;
    
    if (!sessionGroups[browserSessionId]) {
      sessionGroups[browserSessionId] = [];
    }
    
    sessionGroups[browserSessionId].push(session);
  });
  
  // 두번째 단계: 각 그룹에서 가장 최근 세션만 반환
  // 즉, 각 브라우저 세션 ID당 하나의 세션만 표시
  return Object.values(sessionGroups).map(group => {
    // 각 그룹에서 last_activity가 가장 최근인 세션 선택
    const sortedGroup = group.sort((a, b) => 
      new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
    );
    
    // 첫 번째 항목이 가장 최근 항목
    const latestSession = sortedGroup[0];
    
    // 총 그룹 크기 추가
    return {
      ...latestSession,
      group_count: sortedGroup.length
    };
  });
} 