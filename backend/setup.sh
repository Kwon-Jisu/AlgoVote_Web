#!/bin/bash

# 가상환경이 없으면 생성
if [ ! -d "venv" ]; then
    echo "가상환경 생성 중..."
    python -m venv venv
fi

# 가상환경 활성화
echo "가상환경 활성화 중..."
source venv/bin/activate

# 패키지 설치
echo "필요한 패키지 설치 중..."
pip install -r requirements.txt

echo ""
echo "=============================="
echo "설정 완료!"
echo "서버를 실행하려면 다음 명령어를 실행하세요:"
echo "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo "==============================" 