import os
import asyncio
import json
from typing import List, Optional, Dict, Any, Tuple, Callable, Awaitable
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from supabase import create_client, Client
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import SupabaseVectorStore
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain

from .config import (
    GEMINI_API_KEY, 
    GEMINI_MODEL_NAME, 
    GEMINI_CHAT_MODEL, 
    GEMINI_EMBEDDING_MODEL,
    SUPABASE_URL, 
    SUPABASE_KEY, 
    SUPABASE_TABLE_NAME,
    SUPABASE_QUERY_NAME,
    RAG_THINKING_BUDGET,
    RESPONSE_TIMEOUT
)
from .database import Policy
from .schemas import ChatResponse, SourceMetadata

# 상수 정의
DEFAULT_SOURCE = "2025 대선 공약집"
SUPABASE_SOURCE = "Supabase Vector DB"
ERROR_MESSAGE_TIMEOUT = "답변 생성 시간이 초과되었습니다."
ERROR_MESSAGE_SERVER = "서버 오류로 인해 답변을 생성할 수 없습니다."
ERROR_MESSAGE_RAG = "RAG 서버 오류로 인해 답변을 생성할 수 없습니다."
ERROR_MESSAGE_API_KEY = "API 키가 설정되지 않아 응답을 생성할 수 없습니다. 관리자에게 문의하세요."

# Gemini API 키 설정
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    os.environ["GOOGLE_API_KEY"] = GEMINI_API_KEY
else:
    print("경고: Gemini API 키가 설정되지 않았습니다. API 호출이 실패할 수 있습니다.")

# 안전 설정 구성
safety_settings = [
    {
        "category": HarmCategory.HARM_CATEGORY_HARASSMENT,
        "threshold": HarmBlockThreshold.BLOCK_ONLY_HIGH
    },
    {
        "category": HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        "threshold": HarmBlockThreshold.BLOCK_ONLY_HIGH
    },
    {
        "category": HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        "threshold": HarmBlockThreshold.BLOCK_ONLY_HIGH
    },
    {
        "category": HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        "threshold": HarmBlockThreshold.BLOCK_ONLY_HIGH
    },
]

# Gemini 모델 설정
generation_config = {
    "temperature": 0.2,
    "top_p": 0.8,
    "top_k": 40,
    "max_output_tokens": 700,
}

# 프롬프트 템플릿
SYSTEM_PROMPT = """알고투표 어시스턴트로서 정치적 중립성을 유지하며 한국 정치와 선거 공약에 관한 질문에 답변합니다.
질문에 관련된 정확한 정보만 제공하고, 확실하지 않은 내용은 '정확한 정보가 없습니다'라고 답변하세요.
답변은 간결하고 명확하게 작성하되, 중요한 사실은 모두 포함해야 합니다.
100자에서 200자 사이의 간결한 답변을 제공하세요. 답변이 너무 길어지지 않도록 주의하세요."""

# 공통 오류 응답 생성 함수
def create_error_response(error_message: str, source: Optional[str] = None) -> ChatResponse:
    """공통 오류 응답 생성 함수"""
    print(f"오류 발생: {error_message}")
    return ChatResponse(
        answer=f"죄송합니다. {error_message} 잠시 후 다시 시도해주세요.",
        related_policies=[],
        source_metadata=None
    )

# RAG 관련 설정
# Supabase 클라이언트 초기화
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# RAG 컴포넌트 초기화
embeddings = GoogleGenerativeAIEmbeddings(model=GEMINI_EMBEDDING_MODEL)
vector_store = SupabaseVectorStore(
    client=supabase,
    embedding=embeddings,
    table_name=SUPABASE_TABLE_NAME,
    query_name=SUPABASE_QUERY_NAME
)
retriever = vector_store.as_retriever()

# LLM 초기화 - thinking_budget 제거 및 안전한 구성으로 변경
print("LLM 모델 초기화:", GEMINI_CHAT_MODEL)
llm = ChatGoogleGenerativeAI(
    model=GEMINI_MODEL_NAME,  # 더 안정적인 모델 사용
    temperature=0.2,
    max_output_tokens=700,
    convert_system_message_to_human=True
)

# RAG 프롬프트 템플릿
qa_prompt = PromptTemplate.from_template(
    """당신은 질문에 대답하는 어시스턴트입니다.
다음의 검색된 컨텍스트를 활용하여 질문에 답변하세요.
답변을 모를 경우 모른다고 솔직히 답변하세요.
한국어로 답변하고, 반드시 아래 마크다운 형식을 따르세요.

== Markdown 형식 ==

**[질문에 대한 요약 주제]**

---

"[핵심 메시지나 의지]"를 1~2줄로 요약해 작성합니다.

**📌 주요 공약**

- **[공약 1 제목]**  
  [공약 1에 대한 짧고 명확한 설명]

- **[공약 2 제목]**  
  [공약 2에 대한 짧고 명확한 설명]

(※ 공약 개수는 상황에 맞게 3개내로 자연스럽게 조정)

=====

# Context:
{context}

# Question:
{question}

# Answer:"""
)

rewrite_prompt = PromptTemplate.from_template(
    """You are an assistant that rewrites user questions to include relevant context.
Use the conversation history and the user's new question to generate a "contextualized question."
Answer in Korean.

# Conversation History:
{history}

# New Question:
{question}

# Contextualized Question:"""
)

class ControlledConversationBufferMemory(ConversationBufferMemory):
    def save_context(self, *args, **kwargs):
        pass  # 자동 저장을 비활성화합니다

    def write_context(self, inputs: dict, outputs: dict):
        super().save_context(inputs, outputs)

# 메모리 인스턴스 생성
memory = ControlledConversationBufferMemory(
    memory_key="history",
    return_messages=False
)

# RAG 체인 구성
qa_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | qa_prompt
    | llm
    | StrOutputParser()
)

rewrite_chain = LLMChain(
    llm=llm,
    prompt=rewrite_prompt,
    memory=memory,
    output_parser=StrOutputParser(output_key="answer")
)

# 후보자별 맞춤 프롬프트
def get_prompt(candidate):
    """
    후보자별 맞춤형 프롬프트를 생성합니다.
    
    Args:
        candidate: 후보자 이름 또는 후보자 객체
        
    Returns:
        PromptTemplate: 후보자에 맞춰진 프롬프트 템플릿
    """
    # 후보자가 객체인 경우 이름 추출
    candidate_name = candidate.name if hasattr(candidate, 'name') else candidate
    
    template = (
        f"당신은 대한민국 대선 후보 \"{candidate_name}\"입니다.\n\n"
        "아래 문서 내용에 기반하여, 사용자 질문에 대해 마치 당신이 직접 설명하는 것처럼\n"
        "친근하고 자연스러운 톤으로 한국어로 답변하세요.\n\n"
        "답변은 반드시 아래 형식의 Markdown 스타일로 작성하세요.\n\n"
        "**[질문에 대한 요약 주제]**\n\n"
        "[후보자의 핵심 메시지나 의지]를 1~2줄로 요약해 자연스럽게 작성합니다.\n\n"
        "**📌 주요 공약**\n\n"
        "- **[공약 1 제목]**  \n"
        "  [공약 1에 대한 짧고 명확한 설명]\n\n"
        "- **[공약 2 제목]**  \n"
        "  [공약 2에 대한 짧고 명확한 설명]\n\n"
        "(※ 공약 개수는 상황에 맞게 3개 내외로 자연스럽게 조정)\n\n"
        "# Context:\n"
        "{context}\n\n"
        "# Question:\n"
        "{question}\n\n"
        "# Answer:"
    )
    
    return PromptTemplate.from_template(template)

def ask_question(question: str, qa_chain) -> str:
    """
    주어진 질문에 대해 저장된 컨텍스트를 활용하여 답변을 반환합니다.
    """
    answer = qa_chain.invoke(question)
    memory.write_context({"human": question}, {"ai": answer})
    return answer

def ask_followup_question(question: str, qa_chain) -> str:
    """
    후속 질문을 컨텍스트와 대화 이력을 반영하여 재작성한 뒤 답변을 반환합니다.
    """
    contextualized = rewrite_chain.run(question=question)
    answer = qa_chain.invoke(contextualized)
    memory.write_context({"human": question}, {"ai": answer})
    return answer

# 벡터 검색 및 메타데이터 추출 함수
def search_documents(query: str, candidate=None, k=5):
    """
    벡터 DB에서 관련 문서를 검색하고 메타데이터를 추출합니다.
    
    Args:
        query: 검색 쿼리
        candidate: 후보자 (필터링용, 선택적)
        k: 검색할 문서 수
        
    Returns:
        tuple: (문서 리스트, 메타데이터, 관련 정책 리스트)
    """
    try:
        # 검색 필터 설정 (필요한 경우)
        search_filter = {}
        candidate_name = None
        if candidate:
            candidate_name = candidate.name if hasattr(candidate, 'name') else candidate
        
        # 벡터 검색 실행 (k개 문서 검색)
        results = retriever.get_relevant_documents(query, k=k)
        
        # 후보자가 지정된 경우 해당 후보자의 문서만 필터링
        filtered_results = []
        if candidate_name and results:
            for doc in results:
                if hasattr(doc, 'metadata') and doc.metadata:
                    source = doc.metadata.get('source', '')
                    # 소스에 후보자 이름이 포함되어 있는지 확인
                    if candidate_name.lower() in source.lower():
                        filtered_results.append(doc)
            
            # 필터링된 결과가 있으면 사용, 없으면 원래 결과 사용
            if filtered_results:
                results = filtered_results
        
        # 첫 번째 문서의 메타데이터 추출
        source_metadata = None
        related_policies = []
        
        if results and len(results) > 0:
            for doc in results:
                # 메타데이터 추출
                if hasattr(doc, 'metadata') and doc.metadata:
                    # 아직 메타데이터가 설정되지 않았으면 첫 번째 문서의 메타데이터 사용
                    if not source_metadata:
                        metadata = doc.metadata
                        
                        # 새로운 메타데이터 형식 처리
                        source_name = metadata.get('source_name', metadata.get('source', DEFAULT_SOURCE))
                        page_num = metadata.get('page', 0)
                        creation_date = metadata.get('creation_date', '')
                        source_link = metadata.get('source_link', '')
                        candidate_info = metadata.get('candidate', candidate_name)
                        total_pages = metadata.get('total_pages', 0)
                        
                        # 메타데이터 구성
                        source_metadata = SourceMetadata(
                            page=page_num,
                            source=metadata.get('source', source_name),
                            creation_date=creation_date,
                            source_name=source_name,
                            source_link=source_link,
                            candidate=candidate_info
                        )
                    
                    # 관련 정책 추가
                    policy_id = doc.metadata.get('policy_id')
                    if policy_id:
                        policy_info = {
                            "id": policy_id,
                            "title": doc.metadata.get('title', '정책 제목 없음'),
                            "category": doc.metadata.get('category', '분류 없음'),
                            "candidate_id": doc.metadata.get('candidate_id', 0)
                        }
                        # 중복 제거
                        if policy_info not in related_policies:
                            related_policies.append(policy_info)
        
        # 메타데이터가 없는 경우 기본값 설정
        if not source_metadata:
            source_name = DEFAULT_SOURCE
            if candidate_name:
                source_name = f"{candidate_name} 정책자료"
                
            source_metadata = SourceMetadata(
                page=0,
                source=source_name,
                creation_date="",
                source_name=source_name,
                source_link="",
                candidate=candidate_name
            )
        
        return results, source_metadata, related_policies[:5]  # 상위 5개만 반환
    
    except Exception as e:
        print(f"문서 검색 오류: {e}")
        return [], None, []

def chatbot(question, candidate, conversation_history=None):
    """
    후보자별 맞춤형 챗봇 응답을 생성합니다.
    
    Args:
        question: 사용자 질문
        candidate: 후보자 이름 또는 후보자 객체
        conversation_history: 이전 대화 이력 (선택 사항)
        
    Returns:
        str: 후보자 관점의 응답
    """
    # 후보자별 맞춤 프롬프트 생성
    qa_prompt = get_prompt(candidate)
    
    # 후보자별 qa_chain 업데이트
    qa_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | qa_prompt
        | llm
        | StrOutputParser()
    )
    
    # 대화 이력이 있으면 메모리에 로드
    if conversation_history:
        # 메모리 초기화
        memory.clear()
        
        # 대화 이력을 메모리에 추가
        for i in range(0, len(conversation_history), 2):
            if i+1 < len(conversation_history):
                user_msg = conversation_history[i].content
                ai_msg = conversation_history[i+1].content
                memory.write_context({"human": user_msg}, {"ai": ai_msg})
    
    # 대화 이력에 따라 적절한 질문 처리 방식 선택
    if memory.buffer == "":
        return ask_question(question, qa_chain)
    else:
        return ask_followup_question(question, qa_chain)

# 문서 컨텍스트와 함께 챗봇 응답 생성
def chatbot_with_docs(question: str, candidate, documents, conversation_history=None):
    """
    검색된 문서들을 컨텍스트로 활용하여 챗봇 응답을 생성합니다.
    
    Args:
        question: 사용자 질문
        candidate: 후보자 이름 또는 객체
        documents: 검색된 문서 리스트
        conversation_history: 이전 대화 이력 (선택 사항)
        
    Returns:
        str: 생성된 응답
    """
    try:
        print(f"chatbot_with_docs 호출: 질문={question}, 후보자={candidate}, 문서 수={len(documents) if documents else 0}")
        
        # 후보자별 맞춤 프롬프트 생성
        qa_prompt = get_prompt(candidate)
        print(f"프롬프트 생성 완료: {qa_prompt}")
        
        # 문서가 있을 경우 컨텍스트 추출
        context = ""
        if documents and len(documents) > 0:
            for i, doc in enumerate(documents[:3]):  # 상위 3개 문서만 사용
                if hasattr(doc, 'page_content'):
                    context += f"문서 {i+1}:\n{doc.page_content}\n\n"
                    print(f"문서 {i+1} 컨텍스트 추가 (길이: {len(doc.page_content)})")
        
        # 컨텍스트가 없으면 간단한 기본 컨텍스트 사용
        if not context:
            print("문서에서 컨텍스트를 추출할 수 없습니다. 기본 컨텍스트 사용")
            if candidate:
                context = f"{candidate} 후보의 공약과 정책 정보입니다."
            else:
                context = "알고투표 정책 정보입니다."
        
        # 대화 이력이 있으면 메모리에 로드
        if conversation_history:
            # 메모리 초기화
            memory.clear()
            
            # 대화 이력을 메모리에 추가
            for msg in conversation_history:
                if msg.role == "user":
                    user_msg = msg.content
                    # 짝이 되는 assistant 메시지 찾기
                    for resp_msg in conversation_history:
                        if resp_msg.role == "assistant" and conversation_history.index(resp_msg) > conversation_history.index(msg):
                            memory.write_context({"human": user_msg}, {"ai": resp_msg.content})
                            break
            
            print(f"대화 이력 로드 완료: {len(conversation_history)} 메시지")
            
            # 대화 이력 있으면 후속 질문으로 처리
            if memory.buffer:
                print("대화 이력 활용하여 contextualized question 생성")
                contextualized_question = rewrite_chain.run(question=question)
                print(f"Rewritten question: {contextualized_question}")
                
                # 컨텍스트와 재작성된 질문으로 프롬프트 포맷팅
                formatted_prompt = qa_prompt.format(context=context, question=contextualized_question)
            else:
                # 대화 이력 없으면 일반 질문으로 처리
                formatted_prompt = qa_prompt.format(context=context, question=question)
        else:
            # 대화 이력 없으면 일반 질문으로 처리
            formatted_prompt = qa_prompt.format(context=context, question=question)
        
        print(f"포맷된 프롬프트: {formatted_prompt[:100]}...")
        
        # 직접 LLM 호출
        response = llm.invoke(formatted_prompt)
        answer = response.content
        print(f"LLM 응답 수신 (길이: {len(answer)})")
        
        # 메모리에 저장
        memory.write_context({"human": question}, {"ai": answer})
        
        return answer
        
    except Exception as e:
        print(f"chatbot_with_docs 오류: {e}")
        return f"죄송합니다. 답변을 생성하는 중 오류가 발생했습니다: {str(e)}"

# RAG 기반 응답 생성 함수
async def get_rag_response(question: str, candidate=None, conversation_history=None) -> ChatResponse:
    """
    RAG 방식으로 질문에 답변하는 함수
    
    Args:
        question: 사용자 질문
        candidate: 후보자 이름 또는 후보자 객체 (기본값: None)
        conversation_history: 이전 대화 이력 (선택 사항)
        
    Returns:
        ChatResponse: 챗봇 응답 객체
    """
    try:
        # 벡터 DB에서 관련 문서 검색 및 메타데이터 추출
        documents, source_metadata, related_policies = search_documents(question, candidate)
        
        # 검색된 문서를 활용하여 RAG 체인으로 답변 생성
        answer_text = chatbot_with_docs(question, candidate, documents, conversation_history)
        
        # 검색된 메타데이터가 없을 경우 기본값 사용
        if not source_metadata:
            source_name = DEFAULT_SOURCE
            if candidate:
                candidate_name = candidate.name if hasattr(candidate, 'name') else candidate
                source_name = f"{candidate_name} - {source_name}"
                
            source_metadata = SourceMetadata(
                page=0,
                source=source_name,
                creation_date=""
            )
        
        return ChatResponse(
            answer=answer_text,
            related_policies=related_policies,
            source_metadata=source_metadata
        )
    
    except Exception as e:
        return create_error_response(f"{ERROR_MESSAGE_RAG}: {str(e)}")

# 기존 AI 응답 생성 함수
async def get_ai_response(question: str, policies: Optional[List[Policy]] = None) -> ChatResponse:
    """
    기존 Gemini 직접 호출 방식의 응답 생성 함수
    """
    if not GEMINI_API_KEY:
        return create_error_response(ERROR_MESSAGE_API_KEY)
    
    policy_context = ""
    related_policies = []
    source_metadata = None

    if policies and len(policies) > 0:
        policy_context = "다음 정책들을 바탕으로 답변해주세요:\n\n"
        
        # 첫 번째 정책의 메타데이터를 기본 출처로 활용
        first_policy = policies[0]
        if hasattr(first_policy, 'meta_info') and first_policy.meta_info:
            try:
                metadata_dict = json.loads(first_policy.meta_info)
                source_metadata = SourceMetadata(
                    page=metadata_dict.get("page", 0),
                    source=metadata_dict.get("source", DEFAULT_SOURCE),
                    creation_date=metadata_dict.get("creation_date", ""),
                    source_name=metadata_dict.get("source_name", ""),
                    source_link=metadata_dict.get("source_link", ""),
                    candidate=metadata_dict.get("candidate", "")
                )
            except (json.JSONDecodeError, AttributeError, KeyError) as e:
                print(f"메타데이터 파싱 오류: {e}")
        
        for policy in policies:
            policy_text = f"후보: {policy.candidate.name}, 제목: {policy.title}, 카테고리: {policy.category}, 내용: {policy.description}"
            policy_context += policy_text + "\n\n"
            related_policies.append({
                "id": policy.id,
                "candidate_id": policy.candidate_id,
                "title": policy.title,
                "category": policy.category
            })
    
    if policy_context:
        full_prompt = f"{SYSTEM_PROMPT}\n\n{policy_context}\n\n질문: {question}"
    else:
        full_prompt = f"{SYSTEM_PROMPT}\n\n질문: {question}"

    try:
        model = genai.GenerativeModel(
            model_name=GEMINI_MODEL_NAME,
            generation_config=generation_config,
            safety_settings=safety_settings
        )

        # ⏱️ Gemini 호출에 타임아웃 설정
        response = await asyncio.wait_for(
            asyncio.to_thread(model.generate_content, full_prompt),
            timeout=RESPONSE_TIMEOUT
        )

        answer_text = response.text if response.candidates and len(response.candidates) > 0 else "죄송합니다. 질문에 대한 답변을 생성할 수 없습니다. 다른 질문을 시도해주세요."

        # 기본 출처 정보 설정
        if not source_metadata:
            source_metadata = SourceMetadata(
                page=0,
                source=DEFAULT_SOURCE,
                creation_date="",
                source_name="",
                source_link="",
                candidate=""
            )

        return ChatResponse(
            answer=answer_text,
            related_policies=related_policies,
            source_metadata=source_metadata
        )

    except asyncio.TimeoutError:
        return create_error_response(ERROR_MESSAGE_TIMEOUT)
    
    except Exception as e:
        return create_error_response(f"{ERROR_MESSAGE_SERVER}: {str(e)}")