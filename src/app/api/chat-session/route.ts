import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const { session_id, candidate_id } = await req.json();
    
    if (!session_id) {
      return NextResponse.json(
        { error: '세션 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // Supabase에 채팅 세션 생성
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        session_id,
        candidate_id,
        started_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('채팅 세션 생성 오류:', error);
      return NextResponse.json(
        { error: '채팅 세션 생성 실패', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('세션 생성 처리 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류', details: error instanceof Error ? error.message : '알 수 없는 오류' },
      { status: 500 }
    );
  }
} 