import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 가져오거나, 임시로 직접 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://csfftypefvorlimfqlnt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZmZ0eXBlZnZvcmxpbWZxbG50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MTQxMjQsImV4cCI6MjA2MTQ5MDEyNH0.7LdFADJ8I6wL8yAbQXDY7jx2xliuKiXuO03yDX-Gn2c';

// 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 데이터 로그 타입 정의
export type DataLog = {
  id: number;
  update_date: string;
  source_organization: string;
  source_link: string;
  update_target: string;
  change_summary: string;
  note: string | null;
  created_at: string;
};

// 데이터 로그 가져오기
export async function getDataLogs(): Promise<DataLog[]> {
  const { data, error } = await supabase
    .from('data_logs')
    .select('*')
    .order('update_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching data logs:', error);
    return [];
  }
  
  return data || [];
}

// 새 데이터 로그 추가
export async function addDataLog(dataLog: Omit<DataLog, 'id' | 'created_at'>): Promise<DataLog | null> {
  const { data, error } = await supabase
    .from('data_logs')
    .insert([dataLog])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding data log:', error);
    return null;
  }
  
  return data;
} 