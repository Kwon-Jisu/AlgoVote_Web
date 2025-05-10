import { NextRequest, NextResponse } from 'next/server';

// 백엔드 URL을 환경 변수로 설정 (기본값으로 Render 배포 URL 사용)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://algovote.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, match_count } = body;

    console.log(`Sending request to backend: ${BACKEND_URL}/api/question`);

    // 백엔드 API 호출
    const response = await fetch(`${BACKEND_URL}/api/question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.algovote.info',
      },
      body: JSON.stringify({
        question,
        match_count,
        candidate_ids: body.candidate_ids || [],
      }),
      cache: 'no-store'
    });

    // 백엔드 서버에서 508 오류 발생 시 예외 처리
    if (response.status === 508) {
      console.log('Backend returned 508 Loop Detected error');
      return NextResponse.json(
        { 
          answer: "죄송합니다. 요청 처리 중 서버 오류가 발생했습니다. 요청량이 너무 많거나 서버 부하가 높을 수 있습니다. 잠시 후 다시 시도해주세요." 
        },
        { status: 200 }
      );
    }

    if (!response.ok) {
      console.error(`Backend API responded with status: ${response.status}`);
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API 요청 처리 중 오류 발생:', error);
    
    return NextResponse.json(
      { 
        answer: "죄송합니다. 요청을 처리하는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요." 
      },
      { status: 200 } // 클라이언트에게는 200 상태 코드 반환 (오류 메시지 포함)
    );
  }
} 