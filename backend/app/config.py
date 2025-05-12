import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# ===== 데이터베이스 설정 =====
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/algovote")

# ===== AI API 설정 =====
# Gemini API 키 설정 (LLM 및 임베딩 모델용)
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

# Gemini 모델 이름 설정
GEMINI_MODEL_NAME = "gemini-2.0-flash"  # 직접 질문용 모델
GEMINI_CHAT_MODEL = "gemini-2.5-flash-preview-04-17"  # RAG 체인용 모델
GEMINI_EMBEDDING_MODEL = "models/gemini-embedding-exp-03-07"  # 임베딩용 모델

# ===== Supabase 설정 =====
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_TABLE_NAME = "information"
SUPABASE_QUERY_NAME = "match_documents"

# ===== 백엔드 URL 설정 =====
BACKEND_URL = os.getenv("NEXT_PUBLIC_BACKEND_URL")
SITE_URL = os.getenv("NEXT_PUBLIC_SITE_URL")

# ===== 챗봇 설정 =====
RAG_THINKING_BUDGET = 1024  # RAG 모델의 사고 예산(토큰)
RESPONSE_TIMEOUT = 30  # API 응답 타임아웃(초)

# 환경 변수가 설정되지 않은 경우 경고 출력
if not GEMINI_API_KEY:
    print("경고: GOOGLE_API_KEY가 설정되지 않았습니다! .env 파일을 확인하세요.")

# ===== 애플리케이션 설정 =====
APP_NAME = "AlgoVote Backend"
VERSION = "0.1.0"  # 버전 업데이트
DEBUG = os.getenv("DEBUG", "False").lower() == "true" 