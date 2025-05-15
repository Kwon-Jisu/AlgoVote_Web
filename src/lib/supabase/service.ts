import { supabase } from './client';
import { Candidate, Pledge, Statement, QnA, TeamMember } from '@/types';

// Candidate services
export const getCandidates = async (): Promise<Candidate[]> => {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
  
  return data as Candidate[];
};

export const getCandidateById = async (id: string): Promise<Candidate | null> => {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching candidate ${id}:`, error);
    return null;
  }
  
  return data as Candidate;
};

// Pledge services
export const getPledgesByCandidate = async (candidateId: string): Promise<Pledge[]> => {
  const { data, error } = await supabase
    .from('pledges')
    .select('*')
    .eq('candidateId', candidateId)
    .order('order');
  
  if (error) {
    console.error(`Error fetching pledges for candidate ${candidateId}:`, error);
    return [];
  }
  
  return data as Pledge[];
};

// Statement services
export const getStatementsByCandidate = async (candidateId: string): Promise<Statement[]> => {
  const { data, error } = await supabase
    .from('statements')
    .select('*')
    .eq('candidateId', candidateId);
  
  if (error) {
    console.error(`Error fetching statements for candidate ${candidateId}:`, error);
    return [];
  }
  
  return data as Statement[];
};

// QnA services
export const getQnAsByCandidate = async (candidateId: string): Promise<QnA[]> => {
  const { data, error } = await supabase
    .from('qnas')
    .select('*')
    .eq('candidateId', candidateId);
  
  if (error) {
    console.error(`Error fetching Q&As for candidate ${candidateId}:`, error);
    return [];
  }
  
  return data as QnA[];
};

// Team member services
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('id');
  
  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
  
  return data as TeamMember[];
};

// Candidate comparison services
export const getComparisonData = async (
  candidateIds: string[],
  categories: string[]
): Promise<Record<string, Record<string, string>>> => {
  const { data, error } = await supabase
    .from('comparisons')
    .select('*')
    .in('candidateId', candidateIds)
    .in('category', categories);
  
  if (error) {
    console.error('Error fetching comparison data:', error);
    return {};
  }
  
  // Transform the data into the required format
  const result: Record<string, Record<string, string>> = {};
  
  interface ComparisonItem {
    category: string;
    candidateId: string;
    content: string;
  }
  
  data.forEach((item: ComparisonItem) => {
    if (!result[item.category]) {
      result[item.category] = {};
    }
    result[item.category][item.candidateId] = item.content;
  });
  
  return result;
};

// 데이터 로그 인터페이스
export interface DataLog {
  id: number;
  update_date: string;
  source_organization: string;
  update_target: string;
  change_summary: string;
  created_at: string;
}

// 데이터 로그 가져오기
export const getDataLogs = async (): Promise<DataLog[]> => {
  const { data, error } = await supabase
    .from('data_logs')
    .select('*')
    .order('update_date', { ascending: false });
  
  if (error) {
    console.error('데이터 로그 불러오기 오류:', error);
    return [];
  }
  
  return data as DataLog[];
};

// 데이터 로그 추가
export const addDataLog = async (dataLog: Omit<DataLog, 'id' | 'created_at'>): Promise<boolean> => {
  const { error } = await supabase
    .from('data_logs')
    .insert([dataLog]);
  
  if (error) {
    console.error('데이터 로그 추가 오류:', error);
    return false;
  }
  
  return true;
};

// 채팅 세션 및 메시지 관리
export interface ChatSession {
  id: string;
  session_id: string;
  candidate_id: string;
  started_at: string;
  last_activity: string;
  message_count?: number | { count: number };
  group_count?: number;
}

// 소스 메타데이터 인터페이스
export interface SourceMetadata {
  page?: number;
  source?: string;
  creationDate?: string;
  source_name?: string;
  source_link?: string;
  candidate?: string;
  [key: string]: string | number | undefined; // 추가 필드를 위한 인덱스 시그니처
}

export interface ChatMessage {
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

// 특정 세션의 모든 메시지 가져오기
export const getChatMessages = async (sessionId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('chat_session_id', sessionId)
    .order('message_order', { ascending: true });
  
  if (error) {
    console.error('채팅 메시지 조회 오류:', error);
    return [];
  }
  
  return data as ChatMessage[];
};

// 채팅 로그 수집 상태 변경 (활성화/비활성화)
export const toggleChatLogging = async (isEnabled: boolean): Promise<boolean> => {
  // 설정 테이블에 로깅 상태 저장
  const { error } = await supabase
    .from('system_settings')
    .upsert([
      {
        key: 'chat_logging_enabled',
        value: isEnabled,
        updated_at: new Date().toISOString()
      }
    ]);
  
  if (error) {
    console.error('채팅 로깅 상태 변경 오류:', error);
    return false;
  }
  
  return true;
};

// 현재 채팅 로그 수집 상태 확인
export const getChatLoggingStatus = async (): Promise<boolean> => {
  const { data, error } = await supabase
    .from('system_settings')
    .select('value')
    .eq('key', 'chat_logging_enabled')
    .single();
  
  if (error) {
    // 설정이 없으면 기본값으로 true 반환
    if (error.code === 'PGRST116') {
      return true;
    }
    
    console.error('채팅 로깅 상태 조회 오류:', error);
    return true; // 기본적으로 활성화 상태
  }
  
  return data?.value === true || data?.value === 'true';
}; 