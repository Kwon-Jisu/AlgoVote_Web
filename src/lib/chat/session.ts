import { nanoid } from 'nanoid';

/**
 * 세션 ID를 가져오거나 생성하는 함수
 * localStorage에 저장된 세션 ID가 있으면 사용하고, 없으면 새로 생성
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return nanoid();
  }
  
  // localStorage에서 기존 세션 ID 확인
  let sessionId = localStorage.getItem('chatSessionId');
  
  // 없으면 새로 생성
  if (!sessionId) {
    sessionId = nanoid();
    localStorage.setItem('chatSessionId', sessionId);
  }
  
  return sessionId;
}

/**
 * 현재 채팅 세션 ID를 가져오는 함수
 */
export function getCurrentChatSessionId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('currentChatSessionId');
}

/**
 * 현재 채팅 세션 ID를 설정하는 함수
 */
export function setCurrentChatSessionId(chatSessionId: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem('currentChatSessionId', chatSessionId);
}

/**
 * 새로운 채팅 세션을 시작하는 함수
 */
export async function startChatSession(candidateId: string): Promise<string | null> {
  try {
    const sessionId = getOrCreateSessionId();
    
    const response = await fetch('/api/chat-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        candidate_id: candidateId
      }),
    });
    
    if (!response.ok) {
      console.error('채팅 세션 시작 실패:', await response.text());
      return null;
    }
    
    const { id: chatSessionId } = await response.json();
    setCurrentChatSessionId(chatSessionId);
    return chatSessionId;
  } catch (error) {
    console.error('채팅 세션 생성 중 오류:', error);
    return null;
  }
}

/**
 * 채팅 세션 초기화 함수
 */
export function resetChatSession(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem('currentChatSessionId');
} 