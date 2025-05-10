from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os

from .config import DATABASE_URL

# SQLite 사용으로 변경 (메모리 DB 사용)
SQLITE_URL = "sqlite:///:memory:"

try:
    # 데이터베이스 엔진 생성 시도
    engine = create_engine(SQLITE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
except Exception as e:
    print(f"데이터베이스 연결 오류: {e}")
    # 오류 시 메모리 DB 사용
    engine = create_engine("sqlite:///:memory:")
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()

# 데이터베이스 모델
class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    party = Column(String(100))
    slogan = Column(String(255))
    profile_image = Column(String(255))
    policies = relationship("Policy", back_populates="candidate")

class Policy(Base):
    __tablename__ = "policies"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    title = Column(String(255), nullable=False)
    category = Column(String(100))
    description = Column(Text)
    metadata = Column(Text)  # JSON 문자열 형태로 저장되는 메타데이터
    
    candidate = relationship("Candidate", back_populates="policies")

# 데이터베이스 세션 가져오기
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 