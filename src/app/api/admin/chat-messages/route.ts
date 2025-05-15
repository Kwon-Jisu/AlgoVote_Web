import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "세션 ID가 필요합니다." },
        { status: 400 }
      );
    }
    
    // 쿼리 실행
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("chat_session_id", sessionId)
      .order("message_order", { ascending: true });
    
    if (error) {
      console.error("채팅 메시지 조회 오류:", error);
      return NextResponse.json(
        { error: "채팅 메시지 조회 실패", details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("채팅 메시지 조회 중 오류:", error);
    return NextResponse.json(
      { error: "서버 오류", details: error instanceof Error ? error.message : "알 수 없는 오류" },
      { status: 500 }
    );
  }
} 