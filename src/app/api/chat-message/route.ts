import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const message = await req.json();
    
    // 필수 필드 검증
    if (!message.chat_session_id || !message.role || !message.content) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }
    
    // 채팅 세션 업데이트 (마지막 활동 시간)
    await supabase
      .from('chat_sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', message.chat_session_id);
    
    // 채팅 메시지 저장
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        chat_session_id: message.chat_session_id,
        role: message.role,
        content: message.content,
        message_order: message.message_order,
        source_description: message.source_description,
        source_url: message.source_url,
        source_metadata: message.source_metadata || null
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('채팅 메시지 저장 오류:', error);
      return NextResponse.json(
        { error: '채팅 메시지 저장 실패', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('메시지 저장 처리 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류', details: error instanceof Error ? error.message : '알 수 없는 오류' },
      { status: 500 }
    );
  }
} 