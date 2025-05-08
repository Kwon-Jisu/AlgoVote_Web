from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from .config import APP_NAME, VERSION, DEBUG
from .database import get_db, engine, Base, Candidate, Policy
from .schemas import Candidate as CandidateSchema
from .schemas import Policy as PolicySchema
from .schemas import CandidateCreate, PolicyCreate, ChatRequest, ChatResponse
from .ai import get_ai_response

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=APP_NAME,
    version=VERSION,
    debug=DEBUG
)

# CORS 설정
origins = [
    "https://www.algovote.info",
    "http://www.algovote.info",
    "https://algovote.info",
    "http://algovote.info",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,  # 프리플라이트 요청 캐시 시간(초)
)

# CORS 프리플라이트 요청 처리를 위한 미들웨어
@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    response = await call_next(request)
    
    # 요청 오리진 확인
    origin = request.headers.get("origin", "")
    
    # 허용된 오리진이면 CORS 헤더 추가
    if origin in origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Max-Age"] = "86400"
    
    return response

# 프리플라이트 요청을 명시적으로 처리하는 엔드포인트
@app.options("/api/question")
async def options_api_question():
    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Max-Age": "86400",
        }
    )

# 루트 엔드포인트
@app.get("/")
async def root():
    return {"message": "AlgoVote API에 오신 것을 환영합니다!"}

# 후보자 관련 엔드포인트
@app.get("/candidates/", response_model=List[CandidateSchema])
async def read_candidates(db: Session = Depends(get_db)):
    candidates = db.query(Candidate).all()
    return candidates

@app.get("/candidates/{candidate_id}", response_model=CandidateSchema)
async def read_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if candidate is None:
        raise HTTPException(status_code=404, detail="후보자를 찾을 수 없습니다")
    return candidate

@app.post("/candidates/", response_model=CandidateSchema)
async def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    db_candidate = Candidate(**candidate.dict())
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

# 정책 관련 엔드포인트
@app.get("/policies/", response_model=List[PolicySchema])
async def read_policies(candidate_id: Optional[int] = None, db: Session = Depends(get_db)):
    policies = db.query(Policy)
    if candidate_id:
        policies = policies.filter(Policy.candidate_id == candidate_id)
    return policies.all()

@app.post("/policies/", response_model=PolicySchema)
async def create_policy(policy: PolicyCreate, candidate_id: int, db: Session = Depends(get_db)):
    db_policy = Policy(**policy.dict(), candidate_id=candidate_id)
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

# 챗봇 엔드포인트
@app.post("/chat/", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    # 관련 정책 가져오기
    policies = []
    if request.candidate_ids:
        policies = db.query(Policy).filter(Policy.candidate_id.in_(request.candidate_ids)).all()
    
    # AI 응답 생성
    response = await get_ai_response(request.question, policies)
    return response

# 새로운 API 엔드포인트 - /api/question
@app.post("/api/question")
async def answer_question(request: ChatRequest, db: Session = Depends(get_db)):
    # 관련 정책 가져오기
    policies = []
    if request.candidate_ids:
        policies = db.query(Policy).filter(Policy.candidate_id.in_(request.candidate_ids)).all()
    
    # AI 응답 생성
    response = await get_ai_response(request.question, policies)
    
    # CORS 헤더 추가
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
    
    return JSONResponse(content=response.dict(), headers=headers)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 