import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# 데이터베이스 설정
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/algovote")

# OpenAI API 설정
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# 애플리케이션 설정
APP_NAME = "AlgoVote Backend"
VERSION = "0.1.0"
DEBUG = os.getenv("DEBUG", "False").lower() == "true" 