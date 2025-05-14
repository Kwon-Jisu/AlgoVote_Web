'use client';

interface PDFViewerProps {
  pdfUrl: string;
  label?: string;
}

export const PDFViewer = ({ pdfUrl, label = "문서 보기" }: PDFViewerProps) => {
  // pdfUrl이 제공되지 않았을 때의 처리
  if (!pdfUrl) return null;
  
  // URL 인코딩 처리
  const encodedUrl = encodeURIComponent(pdfUrl);
  const pdfJsUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodedUrl}`;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // 새 창으로 PDF 열기
    window.open(pdfJsUrl, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <button 
      onClick={handleClick}
      className="text-[#3449FF] underline hover:text-[#2538cc] transition-colors"
    >
      {label}
    </button>
  );
}; 