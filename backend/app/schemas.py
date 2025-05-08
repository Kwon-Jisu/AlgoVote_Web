from typing import List, Optional
from pydantic import BaseModel

# 정책 스키마
class PolicyBase(BaseModel):
    title: str
    category: Optional[str] = None
    description: Optional[str] = None

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

# AI 응답 스키마
class ChatRequest(BaseModel):
    question: str
    candidate_ids: Optional[List[int]] = None

class ChatResponse(BaseModel):
    answer: str
    related_policies: Optional[List[Policy]] = None 