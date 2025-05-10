import os
import asyncio
from typing import List, Optional
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from .config import GEMINI_API_KEY
from .database import Policy
from .schemas import ChatResponse

# Gemini API 키 설정
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("경고: Gemini API 키가 설정되지 않았습니다. API 호출이 실패할 수 있습니다.")

# 안전 설정 구성
safety_settings = [
    {
        "category": HarmCategory.HARM_CATEGORY_HARASSMENT,
        "threshold": HarmBlockThreshold.BLOCK_ONLY_HIGH
    },
    {
        "category": HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        "threshold": HarmBlockThreshold.BLOCK_ONLY_HIGH
    },
    {
        "category": HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        "threshold": HarmBlockThreshold.BLOCK_ONLY_HIGH
    },
    {
        "category": HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        "threshold": HarmBlockThreshold.BLOCK_ONLY_HIGH
    },
]

# Gemini 모델 설정
generation_config = {
    "temperature": 0.2,
    "top_p": 0.8,
    "top_k": 40,
    "max_output_tokens": 1024,
}

# 프롬프트 템플릿
SYSTEM_PROMPT = """알고투표 어시스턴트로서 정치적 중립성을 유지하며 한국 정치와 선거 공약에 관한 질문에 답변합니다.
질문에 관련된 정확한 정보만 제공하고, 확실하지 않은 내용은 '정확한 정보가 없습니다'라고 답변하세요.
답변은 간결하고 명확하게 작성하되, 중요한 사실은 모두 포함해야 합니다.
답변 마지막에는 항상 '출처: 2024 대선 공약집' 형태로 출처를 표시하세요."""

async def get_ai_response(question: str, policies: Optional[List[Policy]] = None) -> ChatResponse:
    """
    질문에 대한 AI 응답을 생성하는 함수
    
    Args:
        question: 사용자 질문
        policies: 관련 정책 목록 (선택적)
        
    Returns:
        ChatResponse: AI 응답 및 관련 정책
    """
    # API 키가 없는 경우
    if not GEMINI_API_KEY:
        return ChatResponse(
            answer="죄송합니다. API 키가 설정되지 않아 응답을 생성할 수 없습니다. 관리자에게 문의하세요.",
            related_policies=[]
        )
    
    # 관련 정책이 있는 경우 프롬프트에 추가
    policy_context = ""
    related_policies = []
    
    if policies and len(policies) > 0:
        policy_context = "다음 정책들을 바탕으로 답변해주세요:\n\n"
        for policy in policies:
            policy_text = f"후보: {policy.candidate.name}, 제목: {policy.title}, 카테고리: {policy.category}, 내용: {policy.description}"
            policy_context += policy_text + "\n\n"
            related_policies.append({
                "id": policy.id,
                "candidate_id": policy.candidate_id,
                "title": policy.title,
                "category": policy.category
            })
    
    # 최종 프롬프트 구성
    if policy_context:
        full_prompt = f"{SYSTEM_PROMPT}\n\n{policy_context}\n\n질문: {question}"
    else:
        full_prompt = f"{SYSTEM_PROMPT}\n\n질문: {question}"
    
    try:
        # Gemini Pro 모델 생성
        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        # 응답 생성
        response = await asyncio.to_thread(
            model.generate_content,
            full_prompt
        )
        
        # 응답 텍스트 추출
        if response.candidates and len(response.candidates) > 0:
            answer_text = response.text
        else:
            answer_text = "죄송합니다. 질문에 대한 답변을 생성할 수 없습니다. 다른 질문을 시도해주세요."
        
        # 출처 정보가 없으면 추가
        if "출처:" not in answer_text:
            answer_text += "\n\n출처: 2024 대선 공약집"
        
        return ChatResponse(
            answer=answer_text,
            related_policies=related_policies
        )
        
    except Exception as e:
        print(f"AI 응답 생성 중 오류 발생: {str(e)}")
        
        # 구체적인 오류 메시지 추가
        error_message = str(e)
        if "credentials" in error_message.lower():
            return ChatResponse(
                answer="죄송합니다. API 인증에 문제가 발생했습니다. 백엔드 서버의 API 키 설정을 확인해주세요.",
                related_policies=[]
            )
        
        return ChatResponse(
            answer="죄송합니다. 서버 오류로 인해 답변을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.",
            related_policies=[]
        ) 