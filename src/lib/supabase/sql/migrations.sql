-- system_settings 테이블 생성 함수
CREATE OR REPLACE FUNCTION create_system_settings_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'system_settings'
  ) THEN
    CREATE TABLE public.system_settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
    
    -- RLS 정책 설정 (보안)
    ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
    
    -- 인증된 사용자만 읽기 가능
    CREATE POLICY "Allow reads for authenticated users" 
      ON public.system_settings FOR SELECT 
      USING (auth.role() = 'authenticated');
    
    -- 서비스 롤만 쓰기 가능 (관리자)
    CREATE POLICY "Allow service role to manage settings" 
      ON public.system_settings FOR ALL 
      USING (auth.role() = 'service_role');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- chat_sessions 테이블 생성 함수
CREATE OR REPLACE FUNCTION create_chat_sessions_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'chat_sessions'
  ) THEN
    CREATE TABLE public.chat_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id TEXT NOT NULL, -- 브라우저 세션 ID
      candidate_id TEXT,  -- 후보자 ID (nullable)
      started_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      last_activity TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
    
    -- 인덱스 생성
    CREATE INDEX idx_chat_sessions_session_id ON public.chat_sessions(session_id);
    CREATE INDEX idx_chat_sessions_candidate_id ON public.chat_sessions(candidate_id);
    CREATE INDEX idx_chat_sessions_last_activity ON public.chat_sessions(last_activity);
    
    -- RLS 정책 설정
    ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
    
    -- 익명 사용자도 세션 생성 가능
    CREATE POLICY "Allow anonymous session creation" 
      ON public.chat_sessions FOR INSERT 
      TO anon;
    
    -- 인증된 사용자는 모든 세션 읽기 가능
    CREATE POLICY "Allow authenticated users to read sessions" 
      ON public.chat_sessions FOR SELECT 
      TO authenticated;
    
    -- 서비스 롤은 모든 세션 관리 가능
    CREATE POLICY "Allow service role to manage sessions" 
      ON public.chat_sessions FOR ALL 
      USING (auth.role() = 'service_role');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- chat_messages 테이블 생성 함수
CREATE OR REPLACE FUNCTION create_chat_messages_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'chat_messages'
  ) THEN
    CREATE TABLE public.chat_messages (
      id BIGSERIAL PRIMARY KEY,
      chat_session_id UUID NOT NULL,
      role TEXT NOT NULL,  -- 'user' 또는 'bot'
      content TEXT NOT NULL,
      message_order INTEGER NOT NULL,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      source_description TEXT,
      source_url TEXT,
      source_metadata JSONB
    );
    
    -- 인덱스 생성
    CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(chat_session_id);
    CREATE INDEX idx_chat_messages_role ON public.chat_messages(role);
    CREATE INDEX idx_chat_messages_order ON public.chat_messages(message_order);
    
    -- RLS 정책 설정
    ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
    
    -- 익명 사용자도 메시지 생성 가능
    CREATE POLICY "Allow anonymous message creation" 
      ON public.chat_messages FOR INSERT 
      TO anon;
    
    -- 인증된 사용자는 모든 메시지 읽기 가능
    CREATE POLICY "Allow authenticated users to read messages" 
      ON public.chat_messages FOR SELECT 
      TO authenticated;
    
    -- 서비스 롤은 모든 메시지 관리 가능
    CREATE POLICY "Allow service role to manage messages" 
      ON public.chat_messages FOR ALL 
      USING (auth.role() = 'service_role');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- data_logs 테이블 생성 함수
CREATE OR REPLACE FUNCTION create_data_logs_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'data_logs'
  ) THEN
    CREATE TABLE public.data_logs (
      id BIGSERIAL PRIMARY KEY,
      update_date DATE NOT NULL,
      source_organization TEXT NOT NULL,
      update_target TEXT NOT NULL,
      change_summary TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
    
    -- 인덱스 생성
    CREATE INDEX idx_data_logs_update_date ON public.data_logs(update_date);
    
    -- RLS 정책 설정
    ALTER TABLE public.data_logs ENABLE ROW LEVEL SECURITY;
    
    -- 인증된 사용자는 로그 읽기 가능
    CREATE POLICY "Allow authenticated users to read logs" 
      ON public.data_logs FOR SELECT 
      TO authenticated;
    
    -- 서비스 롤은 모든 로그 관리 가능
    CREATE POLICY "Allow service role to manage logs" 
      ON public.data_logs FOR ALL 
      USING (auth.role() = 'service_role');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 외래 키 관계 설정 함수
CREATE OR REPLACE FUNCTION ensure_chat_messages_relation()
RETURNS void AS $$
BEGIN
  -- chat_sessions와 chat_messages 간의 관계 확인 및 설정
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_type = 'FOREIGN KEY' 
    AND table_name = 'chat_messages'
    AND constraint_name = 'chat_messages_session_id_fkey'
  ) THEN
    -- 외래 키 제약 조건 추가
    ALTER TABLE public.chat_messages
    ADD CONSTRAINT chat_messages_session_id_fkey
    FOREIGN KEY (chat_session_id)
    REFERENCES public.chat_sessions(id)
    ON DELETE CASCADE;
  END IF;
END;
$$ LANGUAGE plpgsql; 