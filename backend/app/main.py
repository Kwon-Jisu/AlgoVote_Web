from fastapi import FastAPI, Depends, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any, Callable, Awaitable
import os
import logging
import gc
import time
import asyncio
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from .config import APP_NAME, VERSION, DEBUG
from .database import get_db, engine, Base, Candidate, Policy
from .schemas import Candidate as CandidateSchema
from .schemas import Policy as PolicySchema
from .schemas import CandidateCreate, PolicyCreate, ChatRequest, ChatResponse
from .ai import get_ai_response, get_rag_response

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 데이터베이스 테이블 생성 (오류 처리 추가)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    logger.error(f"데이터베이스 테이블 생성 오류: {e}")
    logger.info("SQLite 메모리 데이터베이스로 계속 진행합니다.")

# 허용할 오리진 리스트
origins = [
    "https://www.algovote.info",
    "http://www.algovote.info",
    "https://algovote.info",
    "http://algovote.info",
    "http://localhost:3000",
    "*"  # 개발 중에는 모든 오리진 허용
]

# 메모리 관리 미들웨어
class MemoryManagementMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # 요청 처리에 1초 이상 걸린 경우 가비지 컬렉션 강제 실행
        if process_time > 1.0:
            logger.info(f"Request took {process_time:.2f}s - Running garbage collection")
            gc.collect()  # 가비지 컬렉션 실행
            
        return response

# 요청 타임아웃 미들웨어
class TimeoutMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp, timeout: int = 60):
        super().__init__(app)
        self.timeout = timeout

    async def dispatch(self, request: Request, call_next):
        try:
            # 타임아웃 설정
            return await asyncio.wait_for(call_next(request), timeout=self.timeout)
        except asyncio.TimeoutError:
            # 타임아웃 발생 시 처리
            logger.error(f"Request timeout after {self.timeout}s")
            return JSONResponse(
                status_code=504,
                content={"message": "요청 처리 시간이 초과되었습니다. 서버가 현재 혼잡한 상태입니다."}
            )

# FastAPI 앱 생성
app = FastAPI(
    title=APP_NAME,
    version=VERSION,
    debug=DEBUG
)

# 미들웨어 추가
app.add_middleware(TimeoutMiddleware, timeout=120)  # 2분 타임아웃
app.add_middleware(MemoryManagementMiddleware)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 오리진 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,  # 프리플라이트 요청 캐시 시간(초)
)

# 프리플라이트 요청에 대한 전용 엔드포인트 (루트 레벨)
@app.options("/{rest_of_path:path}")
async def options_route(rest_of_path: str, request: Request):
    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "86400",
        }
    )

# 공통 오류 응답 생성 함수
def create_error_response(error_type: str, error_message: str) -> ChatResponse:
    """
    챗봇 API의 표준화된 오류 응답 생성
    """
    logger.error(f"{error_type} 오류: {error_message}")
    return ChatResponse(
        answer=f"죄송합니다. {error_message} 잠시 후 다시 시도해주세요.",
        related_policies=[],
        source_metadata=None
    )

# 안전한 API 호출 래퍼 함수
async def safe_api_call(
    api_func: Callable[[str, Any], Awaitable[ChatResponse]], 
    question: str, 
    extra_param: Any = None,
    conversation_history: Optional[List] = None,
    *args, **kwargs
) -> ChatResponse:
    """
    안전한 API 호출 처리를 위한 래퍼 함수
    """
    try:
        if conversation_history is not None:
            # 대화 이력이 있는 경우
            if extra_param is not None:
                return await api_func(question, extra_param, conversation_history, *args, **kwargs)
            else:
                return await api_func(question, None, conversation_history, *args, **kwargs)
        elif extra_param is not None:
            # 대화 이력이 없는 경우
            return await api_func(question, extra_param, *args, **kwargs)
        else:
            return await api_func(question, *args, **kwargs)
    except Exception as e:
        return create_error_response("API 호출", f"요청 처리 중 서버 오류가 발생했습니다: {str(e)}")

# 서버 상태 확인용 헬스체크 엔드포인트
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "서버가 정상적으로 작동 중입니다."}

# 루트 엔드포인트
@app.get("/")
async def root():
    return {"message": "AlgoVote API에 오신 것을 환영합니다!"}

# 후보자 관련 엔드포인트
@app.get("/candidates/", response_model=List[CandidateSchema])
async def read_candidates(db: Session = Depends(get_db)):
    try:
        candidates = db.query(Candidate).all()
        return candidates
    except Exception as e:
        logger.error(f"후보자 목록 조회 오류: {e}")
        return []

@app.get("/candidates/{candidate_id}", response_model=CandidateSchema)
async def read_candidate(candidate_id: int, db: Session = Depends(get_db)):
    try:
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if candidate is None:
            raise HTTPException(status_code=404, detail="후보자를 찾을 수 없습니다")
        return candidate
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"후보자 상세 조회 오류: {e}")
        raise HTTPException(status_code=500, detail="서버 오류가 발생했습니다.")

# 챗봇 API 엔드포인트 (전통적 방식)
@app.post("/chat/", response_model=ChatResponse)
async def chat(request: ChatRequest, background_tasks: BackgroundTasks):
    """
    전통적인 방식의 챗봇 API (기존 Gemini 직접 호출)
    """
    logger.info(f"챗봇 질문 받음: {request.question}")
    return await safe_api_call(get_ai_response, request.question, None)

# RAG 기반 챗봇 API 엔드포인트
@app.post("/rag-chat/", response_model=ChatResponse)
async def rag_chat(request: ChatRequest, background_tasks: BackgroundTasks):
    """
    RAG 기반 챗봇 API (Supabase 벡터 스토어 활용)
    """
    logger.info(f"RAG 질문 받음: {request.question}")
    return await safe_api_call(
        get_rag_response, 
        request.question, 
        request.candidate,
        request.conversation_history
    )

# 레거시 호환 API 엔드포인트
@app.post("/api/question", response_model=ChatResponse)
async def answer_question(request: ChatRequest, background_tasks: BackgroundTasks):
    """
    이전 버전 호환성을 위한 API 엔드포인트 (현재는 RAG 방식으로 처리)
    """
    logger.info(f"API 질문 받음: {request.question}")
    return await safe_api_call(
        get_rag_response, 
        request.question, 
        request.candidate,
        request.conversation_history
    )

# 레거시 Predict 엔드포인트 - RAG 방식으로 통합
@app.post("/predict", response_model=ChatResponse)
async def predict(request: ChatRequest):
    """
    다른 형식의 레거시 엔드포인트 (RAG 방식으로 통합)
    """
    logger.info(f"Predict 질문 받음: {request.question}")
    return await safe_api_call(
        get_rag_response, 
        request.question, 
        request.candidate,
        request.conversation_history
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 