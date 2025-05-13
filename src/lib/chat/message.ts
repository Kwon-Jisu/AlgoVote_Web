import { getCurrentChatSessionId, startChatSession } from './session';

// SourceMetadata 인터페이스 추가
interface SourceMetadata {
  page?: number;
  source?: string;
  creationDate?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  candidateId?: string | number;
  sourceDescription?: string;
  sourceUrl?: string;
  sourceMetadata?: SourceMetadata; // any 타입 대신 구체적인 타입 사용
}

/**
 * 채팅 메시지를 Supabase에 저장하는 함수
 */
export async function saveChatMessage(
  message: ChatMessage, 
  messageOrder: number
): Promise<boolean> {
  try {
    // 현재 활성화된 세션 ID 가져오기
    let chatSessionId = getCurrentChatSessionId();
    
    // 세션 ID가 없으면 새로 생성 (후보자 ID가 있는 경우)
    if (!chatSessionId && message.candidateId) {
      chatSessionId = await startChatSession(message.candidateId.toString());
      if (!chatSessionId) {
        console.error('채팅 세션을 생성할 수 없습니다.');
        return false;
      }
    }
    
    // 세션 ID가 없으면 저장 불가
    if (!chatSessionId) {
      console.error('활성화된 채팅 세션이 없습니다.');
      return false;
    }
    
    // 채팅 메시지 저장 요청
    const response = await fetch('/api/chat-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_session_id: chatSessionId,
        role: message.role,
        content: message.content,
        message_order: messageOrder,
        source_description: message.sourceDescription || null,
        source_url: message.sourceUrl || null,
        source_metadata: message.sourceMetadata || null
      }),
    });
    
    if (!response.ok) {
      console.error('채팅 메시지 저장 실패:', await response.text());
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('채팅 메시지 저장 중 오류:', error);
    return false;
  }
}

/**
 * 여러 메시지를 순차적으로 저장하는 함수
 */
export async function saveMessages(messages: ChatMessage[]): Promise<boolean> {
  let allSaved = true;
  
  for (let i = 0; i < messages.length; i++) {
    const saved = await saveChatMessage(messages[i], i);
    if (!saved) {
      allSaved = false;
    }
  }
  
  return allSaved;
} 