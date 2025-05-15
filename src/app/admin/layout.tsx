import { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "알고투표 관리자",
  description: "알고투표 서비스 관리자 페이지",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`min-h-screen bg-[#F5F7FA] ${inter.className}`}>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/admin" className="text-2xl font-bold text-[#1E1E1E]">
              알고투표 관리자
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link 
                    href="/admin/chat-history" 
                    className="text-[#6B7280] hover:text-[#3449FF]"
                  >
                    대화 내역
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/statistics" 
                    className="text-[#6B7280] hover:text-[#3449FF]"
                  >
                    통계
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/" 
                    className="text-[#6B7280] hover:text-[#3449FF]"
                  >
                    메인 사이트
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 