#!/bin/bash

# 환경 변수 파일 경로
ENV_FILE=".env"

echo "=== AlgoVote 백엔드 실행 스크립트 ==="

# 기존 환경 변수 확인
if [ -f "$ENV_FILE" ]; then
  echo "환경 변수 파일(.env)을 불러옵니다."
  
  # API 키 불러오기
  google_api_key=$(grep -E "^GOOGLE_API_KEY=" "$ENV_FILE" | cut -d '=' -f2)
  supabase_key=$(grep -E "^SUPABASE_KEY=" "$ENV_FILE" | cut -d '=' -f2)
  
  if [ ! -z "$google_api_key" ]; then
    echo "✓ Google API 키가 설정되어 있습니다."
    api_key="$google_api_key"
  else
    echo "⚠️ Google API 키가 설정되어 있지 않습니다."
  fi
  
  if [ ! -z "$supabase_key" ]; then
    echo "✓ Supabase 키가 설정되어 있습니다."
    sb_key="$supabase_key"
  else
    echo "⚠️ Supabase 키는 기본값을 사용합니다."
  fi
else
  echo "환경 변수 파일(.env)이 없습니다. 새로 생성합니다."
  touch "$ENV_FILE"
fi

# Google API 키 입력 받기
if [ -z "$api_key" ]; then
  echo ""
  echo "Google Gemini API 키를 입력하세요 (필수):"
  read api_key
  
  if [ -z "$api_key" ]; then
    echo "⚠️ API 키가 입력되지 않았습니다. 서버가 제대로 작동하지 않을 수 있습니다."
  else
    echo "✓ API 키가 설정되었습니다."
    
    # 환경 변수 파일에 저장
    if grep -q "^GOOGLE_API_KEY=" "$ENV_FILE"; then
      sed -i '' "s/^GOOGLE_API_KEY=.*/GOOGLE_API_KEY=$api_key/" "$ENV_FILE"
    else
      echo "GOOGLE_API_KEY=$api_key" >> "$ENV_FILE"
    fi
    echo "✓ API 키가 .env 파일에 저장되었습니다."
  fi
fi

# Supabase 키 입력 받기 (선택 사항)
echo ""
echo "Supabase 키를 입력하시겠습니까? (기본값 사용: 엔터키, 입력: y)"
read use_supabase_key

if [[ "$use_supabase_key" == "y" || "$use_supabase_key" == "Y" ]]; then
  echo "Supabase 키를 입력하세요 (선택 사항):"
  read sb_key
  
  if [ ! -z "$sb_key" ]; then
    echo "✓ Supabase 키가 설정되었습니다."
    
    # 환경 변수 파일에 저장
    if grep -q "^SUPABASE_KEY=" "$ENV_FILE"; then
      sed -i '' "s/^SUPABASE_KEY=.*/SUPABASE_KEY=$sb_key/" "$ENV_FILE"
    else
      echo "SUPABASE_KEY=$sb_key" >> "$ENV_FILE"
    fi
    echo "✓ Supabase 키가 .env 파일에 저장되었습니다."
  fi
fi

echo ""
echo "=== 백엔드 서버 시작 준비 ==="

# 가상환경 활성화
source venv/bin/activate 2>/dev/null || echo "⚠️ 가상환경이 없습니다. setup.sh를 먼저 실행하세요."

# 환경 변수 설정 및 서버 실행
echo "백엔드 서버를 시작합니다..."
if [ ! -z "$sb_key" ]; then
  GOOGLE_API_KEY="$api_key" SUPABASE_KEY="$sb_key" python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
else
  GOOGLE_API_KEY="$api_key" python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
fi 