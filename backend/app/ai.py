import os
import openai
import asyncio
from typing import List, Optional

from .config import OPENAI_API_KEY
from .database import Policy
from .schemas import ChatResponse

# OpenAI API 키 설정
openai.api_key = OPENAI_API_KEY

async def get_ai_response(question: str, policies: Optional[List[Policy]] = None) -> ChatResponse:
    """
    질문에 대한 AI 응답을 생성하는 함수
    
    Args:
        question: 사용자 질문
        policies: 관련 정책 목록 (선택적)
        
    Returns:
        ChatResponse: AI 응답 및 관련 정책
    """
    # 관련 정책이 있는 경우 프롬프트에 추가
    policy_context = ""
    related_policies = []
    
    if policies and len(policies) > 0:
        policy_context = "다음 정책들을 바탕으로 답변해주세요:\n\n"
        for policy in policies:
            policy_context += f"후보: {policy.candidate.name}\n"
            policy_context += f"정책: {policy.title}\n"
            policy_context += f"설명: {policy.description}\n\n"
            related_policies.append(policy)
    
    # 프롬프트 구성
    prompt = f"""
    당신은 선거 정책 분석 AI입니다. 객관적이고 중립적으로 답변해주세요.
    
    {policy_context}
    
    질문: {question}
    """
    
    # OpenAI API 호출 (타임아웃 설정)
    try:
        # 타임아웃 60초로 설정
        async def run_with_timeout():
            # gpt-4보다 더 가볍고 빠른 gpt-3.5-turbo 모델로 변경
            response = await asyncio.to_thread(
                openai.ChatCompletion.create,
                model="gpt-3.5-turbo",  # 더 빠른 모델 사용
                messages=[
                    {"role": "system", "content": "당신은 선거 정책 분석 전문가로, 객관적이고 중립적으로 답변합니다."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,  # 토큰 수 감소
                temperature=0.7,
                request_timeout=30  # OpenAI API 요청 타임아웃 설정
            )
            return response

        # 60초 후 타임아웃
        response = await asyncio.wait_for(run_with_timeout(), timeout=60.0)
        
        answer = response.choices[0].message["content"].strip()
        
        return ChatResponse(
            answer=answer,
            related_policies=related_policies
        )
    except asyncio.TimeoutError:
        print("OpenAI API 호출 타임아웃")
        return ChatResponse(
            answer="죄송합니다. 응답 생성 시간이 초과되었습니다. 서버가 현재 혼잡한 상태입니다. 잠시 후 다시 시도해주세요.",
            related_policies=[]
        )    
    except Exception as e:
        print(f"OpenAI API 오류: {e}")
        return ChatResponse(
            answer="죄송합니다. 현재 AI 답변 서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
            related_policies=[]
        ) 