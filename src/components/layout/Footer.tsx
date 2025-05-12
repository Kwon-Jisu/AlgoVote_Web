import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <p className="text-text-secondary mb-2">© 2025 알고투표. All rights reserved.</p>
        <p className="text-text-secondary text-sm">※ 알고투표는 특정 후보를 지지하거나 반대하지 않습니다.</p>
        <p className="text-sm text-text-secondary">
            알고투표가 궁금하다면, <Link href="/about" className="underline text-primary hover:text-primary-dark transition-colors">소개 페이지</Link>를 확인해보세요.
        </p>
      </div>

    </footer>
  );
} 