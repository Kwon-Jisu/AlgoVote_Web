'use client';

import React, { useState } from 'react';
import { addDataLog } from '@/lib/supabase';

export default function DataLogForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [formData, setFormData] = useState({
    update_date: new Date().toISOString().split('T')[0],
    source_organization: '',
    source_link: '',
    update_target: '',
    change_summary: '',
    note: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    try {
      const result = await addDataLog(formData);
      
      if (result) {
        setMessage({ text: '데이터 로그가 성공적으로 추가되었습니다.', type: 'success' });
        // 폼 초기화
        setFormData({
          update_date: new Date().toISOString().split('T')[0],
          source_organization: '',
          source_link: '',
          update_target: '',
          change_summary: '',
          note: ''
        });
      } else {
        setMessage({ text: '데이터 로그 추가에 실패했습니다.', type: 'error' });
      }
    } catch (error) {
      console.error('Error adding data log:', error);
      setMessage({ text: '오류가 발생했습니다.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-divider">
      <h2 className="text-xl font-semibold mb-4">데이터 로그 추가</h2>
      
      {message && (
        <div 
          className={`p-3 mb-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="update_date" className="block text-sm font-medium text-text-secondary mb-1">
            업데이트 날짜
          </label>
          <input
            type="date"
            id="update_date"
            name="update_date"
            value={formData.update_date}
            onChange={handleChange}
            required
            className="w-full p-2 border border-divider rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label htmlFor="source_organization" className="block text-sm font-medium text-text-secondary mb-1">
            출처 기관
          </label>
          <input
            type="text"
            id="source_organization"
            name="source_organization"
            value={formData.source_organization}
            onChange={handleChange}
            required
            className="w-full p-2 border border-divider rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="중앙선거관리위원회"
          />
        </div>
        
        <div>
          <label htmlFor="source_link" className="block text-sm font-medium text-text-secondary mb-1">
            출처 링크
          </label>
          <input
            type="url"
            id="source_link"
            name="source_link"
            value={formData.source_link}
            onChange={handleChange}
            required
            className="w-full p-2 border border-divider rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://www.example.com"
          />
        </div>
        
        <div>
          <label htmlFor="update_target" className="block text-sm font-medium text-text-secondary mb-1">
            업데이트 대상
          </label>
          <input
            type="text"
            id="update_target"
            name="update_target"
            value={formData.update_target}
            onChange={handleChange}
            required
            className="w-full p-2 border border-divider rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="후보자 공약집"
          />
        </div>
        
        <div>
          <label htmlFor="change_summary" className="block text-sm font-medium text-text-secondary mb-1">
            변경사항 요약
          </label>
          <input
            type="text"
            id="change_summary"
            name="change_summary"
            value={formData.change_summary}
            onChange={handleChange}
            required
            className="w-full p-2 border border-divider rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="정책 업데이트 내용 요약"
          />
        </div>
        
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-text-secondary mb-1">
            비고
          </label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={2}
            className="w-full p-2 border border-divider rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="추가 참고사항 (선택사항)"
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {isLoading ? '추가 중...' : '데이터 로그 추가'}
          </button>
        </div>
      </form>
    </div>
  );
} 