# AlgoVote 백엔드

알고투표 서비스를 위한 FastAPI 기반 백엔드 애플리케이션입니다.

## 기술 스택

- Python 3.11+
- FastAPI: REST API 프레임워크
- SQLAlchemy: ORM
- PostgreSQL: 데이터베이스
- OpenAI API: AI 답변 생성

## 구조

```
backend/
├── app/
│   ├── __init__.py     # 패키지 초기화
│   ├── main.py         # FastAPI 애플리케이션 및 라우트
│   ├── database.py     # 데이터베이스 모델 및 연결
│   ├── schemas.py      # Pydantic 스키마
│   ├── ai.py           # AI 관련 기능
│   └── config.py       # 환경 설정
├── requirements.txt    # 종속성 목록
└── .env                # 환경 변수 (생성 필요)
```

## 설치 및 실행

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
# 데이터베이스 연결 정보
DATABASE_URL=postgresql://user:password@localhost/algovote

# OpenAI API 키
OPENAI_API_KEY=your_openai_api_key

# 디버그 모드 (True/False)
DEBUG=False
```

4. 서버 실행

```bash
uvicorn app.main:app --reload
```

서버가 시작되면 `http://localhost:8000` 에서 API에 접근할 수 있으며,
`http://localhost:8000/docs`에서 API 문서를 확인할 수 있습니다.

## API 엔드포인트

- `GET /`: API 루트
- `GET /candidates/`: 모든 후보자 조회
- `GET /candidates/{id}`: 특정 후보자 조회
- `POST /candidates/`: 후보자 생성 
- `GET /policies/`: 모든 정책 조회
- `POST /policies/`: 정책 생성
- `POST /chat/`: AI 챗봇과 대화
- `POST /api/question`: 질문에 대한 AI 답변 생성 (웹 프론트엔드용 엔드포인트) 