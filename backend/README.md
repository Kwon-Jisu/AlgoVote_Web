# AlgoVote 백엔드

알고투표 서비스를 위한 FastAPI 기반 백엔드 애플리케이션입니다.

## 기술 스택

- Python 3.11+
- FastAPI: REST API 프레임워크
- SQLAlchemy: ORM
- SQLite/PostgreSQL: 데이터베이스
- Google Gemini Pro: AI 답변 생성
- LangChain: RAG(Retrieval Augmented Generation) 구현
- Supabase: 벡터 스토어 

## 구조

```
backend/
├── app/
│   ├── __init__.py     # 패키지 초기화
│   ├── main.py         # FastAPI 애플리케이션 및 라우트
│   ├── database.py     # 데이터베이스 모델 및 연결
│   ├── schemas.py      # Pydantic 스키마
│   ├── ai.py           # AI 관련 기능 및 RAG 구현
│   └── config.py       # 환경 설정 및 API 키 관리
├── requirements.txt    # 종속성 목록
├── setup.sh            # 초기 설정 스크립트
├── run_backend.sh      # 백엔드 실행 스크립트
└── .env                # 환경 변수 (자동 생성)
```

## 설치 및 실행

### 자동 설치 (권장)

1. 설정 스크립트 실행

```bash
chmod +x setup.sh
./setup.sh
```

2. 실행 스크립트 실행

```bash
chmod +x run_backend.sh
./run_backend.sh
```

실행 스크립트는 필요한 API 키를 설정하고 백엔드 서버를 시작합니다.

### 수동 설치

1. 가상 환경 설정

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. 종속성 설치

```bash
pip install -r requirements.txt
```

3. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가합니다:

```
# Google Gemini API 키 (필수)
GOOGLE_API_KEY=your_gemini_api_key

# Supabase 설정 (선택 사항 - 기본값 있음)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# 데이터베이스 설정 (선택 사항)
DATABASE_URL=sqlite:///:memory:

# 디버그 모드 (True/False)
DEBUG=False
```

4. 서버 실행

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

서버가 시작되면 `http://localhost:8000` 에서 API에 접근할 수 있으며,
`http://localhost:8000/docs`에서 API 문서를 확인할 수 있습니다.

## 챗봇 API 엔드포인트

알고투표는 두 가지 방식의 챗봇 기능을 제공합니다:

### 1. 전통적인 LLM 방식

- `POST /chat/`: 기본 Gemini API를 사용한 챗봇
- 질문에 직접 답변합니다

### 2. RAG(Retrieval Augmented Generation) 방식

- `POST /rag-chat/`: Supabase 벡터 스토어를 활용한 고급 챗봇 (권장)
- 저장된 문서에서 관련 정보를 검색하여 답변합니다
- 대화 이력을 기억하여 후속 질문에 더 적절히 대응합니다

### 레거시 호환성 엔드포인트

- `POST /api/question`: 웹 프론트엔드용 (현재는 RAG 방식 사용)
- `POST /predict`: 다른 클라이언트용 (현재는 RAG 방식 사용)

## 기본 API 엔드포인트

- `GET /`: API 루트
- `GET /health`: 서버 상태 확인
- `GET /candidates/`: 모든 후보자 조회
- `GET /candidates/{id}`: 특정 후보자 조회

## API 엔드포인트

- `GET /policies/`: 모든 정책 조회
- `POST /policies/`: 정책 생성 