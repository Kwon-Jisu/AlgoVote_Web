#!/bin/bash

# 환경 변수 파일 경로
ENV_FILE=".env"

# 기존 API 키 확인
if [ -f "$ENV_FILE" ]; then
  existing_key=$(grep -E "^GOOGLE_API_KEY=" "$ENV_FILE" | cut -d '=' -f2)
  if [ ! -z "$existing_key" ]; then
    echo "기존 Gemini API 키를 사용합니다."
    api_key="$existing_key"
  fi
fi

# 기존 키가 없는 경우 입력 요청
if [ -z "$api_key" ]; then
  echo "Google Gemini API 키를 입력하세요:"
  read api_key
  
  # 입력된 API 키 확인
  if [ -z "$api_key" ]; then
    echo "API 키가 입력되지 않았습니다. 기본 설정으로 진행합니다."
  else
    echo "API 키가 설정되었습니다."
    
    # 입력된 키를 .env 파일에 저장할지 물어보기
    echo "입력한 API 키를 .env 파일에 저장할까요? (y/n)"
    read save_key
    
    if [[ "$save_key" == "y" || "$save_key" == "Y" ]]; then
      # .env 파일이 없으면 생성
      if [ ! -f "$ENV_FILE" ]; then
        touch "$ENV_FILE"
      fi
      
      # 기존 GOOGLE_API_KEY 항목이 있으면 교체, 없으면 추가
      if grep -q "^GOOGLE_API_KEY=" "$ENV_FILE"; then
        sed -i '' "s/^GOOGLE_API_KEY=.*/GOOGLE_API_KEY=$api_key/" "$ENV_FILE"
      else
        echo "GOOGLE_API_KEY=$api_key" >> "$ENV_FILE"
      fi
      
      echo "API 키가 .env 파일에 저장되었습니다."
    fi
  fi
else
  echo "API 키가 설정되었습니다."
fi

# 가상환경 활성화
source venv/bin/activate 2>/dev/null || echo "가상환경이 없습니다. 가상환경을 먼저 설정해주세요."

# API 키 환경변수로 설정 후 실행
echo "백엔드 서버를 시작합니다..."
GOOGLE_API_KEY="$api_key" python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 