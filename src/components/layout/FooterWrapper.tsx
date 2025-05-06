'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  const isFooterHidden = pathname.startsWith('/chatbot/');
  return !isFooterHidden ? <Footer /> : null;
}
