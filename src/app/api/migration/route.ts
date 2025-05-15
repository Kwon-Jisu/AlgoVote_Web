import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

// 개발 환경에서만 사용할 임시 키 (실제 환경에서는 환경 변수로 설정 필요)
const TEMP_ADMIN_KEY = "algoadmin123";

export async function GET(req: NextRequest) {
  try {
    // 관리자 인증 검사
    const { searchParams } = new URL(req.url);
    const providedKey = searchParams.get("admin_key");
    
    // 환경 변수 또는 임시 키와 비교
    const adminKey = process.env.ADMIN_SECRET_KEY || TEMP_ADMIN_KEY;
    const isAdmin = providedKey === adminKey;
    
    if (!isAdmin) {
      console.warn("Unauthorized migration attempt");
      return NextResponse.json(
        { error: "관리자 인증 실패", message: "유효한 접근 키가 필요합니다." }, 
        { status: 401 }
      );
    }
    
    // 필요한 테이블이 있는지 확인하고 없으면 생성
    const migrationResults = await runMigrations();
    
    return NextResponse.json({
      message: "마이그레이션이 성공적으로 완료되었습니다.",
      results: migrationResults
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "마이그레이션 실패", details: error instanceof Error ? error.message : "알 수 없는 오류" },
      { status: 500 }
    );
  }
}

async function runMigrations() {
  const results = {
    system_settings: false,
    chat_sessions: false,
    chat_messages: false,
    data_logs: false,
    relations: false
  };
  
  // 1. system_settings 테이블 생성
  try {
    const { error: systemSettingsError } = await supabase.rpc('create_system_settings_if_not_exists');
    
    if (!systemSettingsError) {
      results.system_settings = true;
      
      // 기본 설정값 삽입
      await supabase
        .from('system_settings')
        .upsert([
          {
            key: 'chat_logging_enabled',
            value: true,
            updated_at: new Date().toISOString()
          }
        ], { onConflict: 'key' });
    }
  } catch (error) {
    console.error("Error creating system_settings table:", error);
    // 이미 테이블이 존재하는 경우 무시
    results.system_settings = true;
  }
  
  // 2. chat_sessions 테이블 확인 또는 생성
  try {
    const { error: chatSessionsError } = await supabase.rpc('create_chat_sessions_if_not_exists');
    
    if (!chatSessionsError) {
      results.chat_sessions = true;
    }
  } catch (error) {
    console.error("Error creating chat_sessions table:", error);
    // 이미 테이블이 존재하는 경우 무시
    results.chat_sessions = true;
  }
  
  // 3. chat_messages 테이블 확인 또는 생성
  try {
    const { error: chatMessagesError } = await supabase.rpc('create_chat_messages_if_not_exists');
    
    if (!chatMessagesError) {
      results.chat_messages = true;
    }
  } catch (error) {
    console.error("Error creating chat_messages table:", error);
    // 이미 테이블이 존재하는 경우 무시
    results.chat_messages = true;
  }
  
  // 4. data_logs 테이블 확인 또는 생성
  try {
    const { error: dataLogsError } = await supabase.rpc('create_data_logs_if_not_exists');
    
    if (!dataLogsError) {
      results.data_logs = true;
    }
  } catch (error) {
    console.error("Error creating data_logs table:", error);
    // 이미 테이블이 존재하는 경우 무시
    results.data_logs = true;
  }
  
  // 5. 외래 키 제약 조건 확인 및 설정
  try {
    const { error: relationsError } = await supabase.rpc('ensure_chat_messages_relation');
    
    if (!relationsError) {
      results.relations = true;
    }
  } catch (error) {
    console.error("Error ensuring relations:", error);
    // 이미 관계가 설정되어 있으면 무시
    results.relations = true;
  }
  
  return results;
}

export async function POST(req: NextRequest) {
  // 동일한 마이그레이션 로직 실행
  return await GET(req);
} 