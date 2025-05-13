import { supabase } from '@/lib/supabase/client';
import { getCurrentChatSessionId } from './session';

/**
 * 특정 세션의 모든 대화를 조회하는 함수
 */
export async function getChatHistory(chatSessionId?: string) {
  try {
    // 세션 ID가 제공되지 않으면 현재 세션 ID 사용
    const sessionId = chatSessionId || getCurrentChatSessionId();
    
    if (!sessionId) {
      console.error('채팅 세션 ID가 없습니다.');
      return [];
    }
    
    // 메시지 조회
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_session_id', sessionId)
      .order('message_order', { ascending: true });
      
    if (error) {
      console.error('채팅 이력 조회 오류:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('채팅 이력 조회 중 오류:', error);
    return [];
  }
}

/**
 * 특정 후보자와의 모든 대화 세션을 조회하는 함수
 */
export async function getCandidateChatSessions(candidateId: string) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('last_activity', { ascending: false });
      
    if (error) {
      console.error('후보자 채팅 세션 조회 오류:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('후보자 채팅 세션 조회 중 오류:', error);
    return [];
  }
}

/**
 * 특정 사용자(브라우저)의 모든 세션을 조회하는 함수
 */
export async function getUserChatSessions() {
  try {
    // localStorage에서 세션 ID 가져오기
    if (typeof window === 'undefined') {
      return [];
    }
    
    const sessionId = localStorage.getItem('chatSessionId');
    
    if (!sessionId) {
      return [];
    }
    
    // 세션 ID로 모든 채팅 세션 조회
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .order('last_activity', { ascending: false });
      
    if (error) {
      console.error('사용자 채팅 세션 조회 오류:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('사용자 채팅 세션 조회 중 오류:', error);
    return [];
  }
} 