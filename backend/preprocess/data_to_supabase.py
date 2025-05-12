from dotenv import load_dotenv
import os
import time

from supabase import create_client
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.document_loaders import TextLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_google_genai._common import GoogleGenerativeAIError

from langchain.chains import LLMChain

# .env 파일 로드
load_dotenv()
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(supabase_url, supabase_key)
google_api_key = os.getenv("GOOGLE_API_KEY")

embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-exp-03-07", google_api_key=google_api_key)

# 파일 경로 및 이름 설정
file_path = "../preprocess/2025.05.02.txt"
file_name = os.path.basename(file_path)

# 문서 불러오기 (.txt 파일)
loader = TextLoader(file_path, encoding="utf-8")
documents = loader.load()

# Splitter 정의 및 실행
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=20)

docs = text_splitter.split_documents(documents)

i = 0
for doc in docs:
    success = False
    while not success:
        try:
            SupabaseVectorStore.from_documents(
                documents=[doc],
                embedding=embeddings,
                client=supabase,
                table_name="debate_information"
            )
            print(f"{len(docs)}개 중 {i+1}개 완료, ✅대기중...")
            time.sleep(3)
            success = True  # 성공 시 루프 탈출
        except GoogleGenerativeAIError as e:
            if "429" in str(e) or "Resource has been exhausted" in str(e):
                print("⚠️ 429 에러 발생: 리소스 초과. 5초 대기 후 재시도합니다...")
                time.sleep(5)
            else:
                raise e  # 다른 예외는 그대로 발생
    i += 1

print("모든 배치가 Supabase에 업로드 완료되었습니다.")