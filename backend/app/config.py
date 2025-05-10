import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# 데이터베이스 설정
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/algovote")

# Gemini API 설정
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY", "")

# 환경 변수가 설정되지 않은 경우 경고 출력
if not GEMINI_API_KEY:
    print("경고: GOOGLE_API_KEY가 설정되지 않았습니다! .env 파일을 확인하세요.")

# 애플리케이션 설정
APP_NAME = "AlgoVote Backend"
VERSION = "0.1.0"
DEBUG = os.getenv("DEBUG", "False").lower() == "true" 