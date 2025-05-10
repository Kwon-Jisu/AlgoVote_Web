import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, match_count } = body;

    // 백엔드 API 호출
    const response = await fetch('http://localhost:8000/api/question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        match_count,
      }),
    });

    // 백엔드 서버에서 508 오류 발생 시 예외 처리
    if (response.status === 508) {
      return NextResponse.json(
        { 
          answer: "죄송합니다. 요청 처리 중 서버 오류가 발생했습니다. 요청량이 너무 많거나 서버 부하가 높을 수 있습니다. 잠시 후 다시 시도해주세요." 
        },
        { status: 200 }
      );
    }

    if (!response.ok) {
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
      { status: 500 }
    );
  }
} 