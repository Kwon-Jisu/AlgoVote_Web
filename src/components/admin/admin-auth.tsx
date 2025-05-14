'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 해시된 비밀번호 (실제 프로덕션에서는 서버 측에서 처리해야 함)
// Algovote0514! 의 해시값 
const ADMIN_PASSWORD_HASH = 'b8f9ebe0d237f29871bd24c96acc2b804fcbf35b20a5a515c23e11901454d980';

// 간단한 해시 함수
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// 로컬 스토리지 키
const AUTH_KEY = 'algovote-admin-auth';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 로컬 스토리지에서 인증 상태 확인
    const authToken = localStorage.getItem(AUTH_KEY);
    if (authToken === ADMIN_PASSWORD_HASH) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const hashedPassword = await hashPassword(password);
      
      if (hashedPassword === ADMIN_PASSWORD_HASH) {
        // 인증 성공
        localStorage.setItem(AUTH_KEY, hashedPassword);
        setIsAuthenticated(true);
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('인증 처리 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="mt-2 text-text-secondary">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">관리자 로그인</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                관리자 비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-divider rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              로그인
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-primary hover:underline text-sm"
            >
              홈페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm flex items-center"
        >
          <i className="ri-logout-box-line mr-1"></i> 로그아웃
        </button>
      </div>
      {children}
    </div>
  );
} 