import { ChatMessage, Candidate } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

interface ChatMessageProps {
  message: ChatMessage;
  candidate?: Candidate;
  saveMessageToLog?: boolean;
  sessionId?: string;
}

export default function ChatMessageComponent({ 
  message, 
  candidate, 
  saveMessageToLog = false,
  sessionId
}: ChatMessageProps) {
  // 채팅 로그 저장 기능
  useEffect(() => {
    if (saveMessageToLog && sessionId) {
      const saveMessageLog = async () => {
        try {
          // 채팅 메시지 API로 메시지 저장
          const payload = {
            chat_session_id: sessionId,
            role: message.role,
            content: message.content,
            message_order: parseInt(message.id.replace('msg-', '')), // 메시지 순서
            source_description: message.sourceDescription,
            source_url: message.sourceUrl,
            source_metadata: message.sourceMetadata
          };

          await fetch('/api/chat-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (error) {
          console.error('메시지 로그 저장 실패:', error);
        }
      };

      saveMessageLog();
    }
  }, [message, saveMessageToLog, sessionId]);

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-primary text-white py-3 px-4 rounded-2xl rounded-tr-sm max-w-[80%]">
          <p>{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mb-4">
      {candidate && (
        <div className="flex-shrink-0 mr-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={candidate.profileImage}
              alt={`${candidate.name} 후보`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
      <div className="flex flex-col max-w-[80%]">
        <div className="bg-gray-100 py-3 px-4 rounded-2xl rounded-tl-sm">
          <p>{message.content}</p>
        </div>
        
        {(message.sourceUrl || message.sourceDescription) && (
          <div className="mt-2 bg-gray-50 border border-divider rounded-md p-3">
            <p className="text-xs font-medium text-secondary mb-1">📎 출처</p>
            {message.sourceDescription && (
              <p className="text-sm mb-1">{message.sourceDescription}</p>
            )}
            {message.sourceUrl && (
              <Link 
                href={message.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                공식 문서 보기 →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 