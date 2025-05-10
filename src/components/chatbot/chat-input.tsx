'use client';

import { FormEvent, useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = '질문을 입력해주세요...' 
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t border-divider bg-white">
      {disabled && (
        <div className="px-4 py-2 text-xs text-text-secondary bg-[#f8f9fa] rounded mt-1 mb-2">
          <p>🔄 서버 요청을 처리 중입니다. 최대 60초가 소요될 수 있습니다.</p>
          <p>첫 질문은 백엔드 서버가 준비되는 시간으로 인해 더 오래 걸릴 수 있습니다.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="py-4 px-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 py-3 px-4 rounded-full border border-divider focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder={placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={disabled}
          />
          <button
            type="submit"
            className="bg-primary text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!message.trim() || disabled}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
} 