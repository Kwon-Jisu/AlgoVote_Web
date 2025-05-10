# 로컬 FastAPI 백엔드 실행 방법

## 1. 환경 설정

### 가상환경 설정
```bash
# backend 디렉토리로 이동
cd backend

# 가상환경 확인 또는 생성
source venv/bin/activate
```

### 환경 변수 설정
`.env` 파일을 backend 디렉토리에 생성하고 다음 내용을 추가합니다:
```
DATABASE_URL=postgresql://user:password@localhost/algovote
GEMINI_API_KEY=your_gemini_api_key_here
```

## 2. 의존성 설치
```bash
pip install -r requirements.txt
```

## 3. FastAPI 서버 실행

**올바른 방법**: 아래 명령어를 사용하여 FastAPI 서버를 실행합니다.
```bash
# backend 디렉토리에서 실행
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

> 주의: `cd app && uvicorn main:app` 방식으로 실행하면 상대 임포트 오류가 발생합니다.

## 4. Next.js 연동 확인

1. `next.config.ts` 파일에서 API 요청 설정이 로컬 서버를 가리키도록 설정:
```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8000/api/:path*',
    },
  ]
}
```

2. `src/app/api/question/route.ts` 파일에서 백엔드 URL이 로컬 서버를 가리키는지 확인:
```javascript
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
```

## 5. 문제 해결

### 상대 경로 임포트 오류
```
ImportError: attempted relative import with no known parent package
```
- 해결: `python -m uvicorn app.main:app` 형식으로 실행

### 타임아웃 오류
프론트엔드에서 `AbortError: This operation was aborted` 오류가 발생하는 경우:
- 백엔드 서버가 정상적으로 실행 중인지 확인
- `http://localhost:8000/health` 엔드포인트로 서버 상태 확인
- 타임아웃 설정 값 증가 (route.ts 파일에서 30000 → 60000)
