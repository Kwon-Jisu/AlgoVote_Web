from typing import List, Optional, Dict, Any
from pydantic import BaseModel

# 정책 스키마
class PolicyBase(BaseModel):
    title: str
    category: Optional[str] = None
    description: Optional[str] = None
    meta_info: Optional[str] = None  # JSON 문자열 형태의 메타데이터

class PolicyCreate(PolicyBase):
    pass

class Policy(PolicyBase):
    id: int
    candidate_id: int
    
    class Config:
        orm_mode = True

# 후보자 스키마
class CandidateBase(BaseModel):
    name: str
    party: Optional[str] = None
    slogan: Optional[str] = None
    profile_image: Optional[str] = None

class CandidateCreate(CandidateBase):
    pass

class Candidate(CandidateBase):
    id: int
    policies: List[Policy] = []
    
    class Config:
        orm_mode = True

# 대화 메시지 스키마
class ChatMessage(BaseModel):
    role: str  # 'user' 또는 'assistant'
    content: str

# 출처 메타데이터 스키마
class SourceMetadata(BaseModel):
    page: int
    source: str
    creation_date: str
    source_name: str
    source_link: str
    candidate: str

# AI 응답 스키마
class ChatRequest(BaseModel):
    question: str
    candidate_ids: Optional[List[int]] = None
    candidate: Optional[str] = None  # 후보자 이름 또는 식별자
    conversation_history: Optional[List[ChatMessage]] = None  # 대화 이력

class ChatResponse(BaseModel):
    answer: str
    related_policies: Optional[List[Dict[str, Any]]] = None
    source_metadata: Optional[SourceMetadata] = None 