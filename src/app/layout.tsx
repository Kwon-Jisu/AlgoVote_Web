import React from 'react';
import './globals.css'
import type { Metadata } from 'next'
import { Inter, Roboto } from 'next/font/google'
import Header from '@/components/layout/Header'
import FooterWrapper from '@/components/layout/FooterWrapper';
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/next"

// Google Fonts를 next/font를 통해 로딩
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: '알고투표 - 정확한 정보를 바탕으로, 현명한 선택을',
  description: '더 나은 선택, 객관적인 정보 비교로부터. 알고투표는 정책과 비전을 쉽게 비교해 현명한 결정을 돕습니다.',
  icons: {
    icon: '/favicon-96x96.png',
  },
  verification: {
    google: 'snL0p51GqrQvKnaFxjpv19b8rvYDYYF66HBF5L9q61s',
  },
  openGraph: {
    title: "알고투표 - 정확한 정보를 바탕으로, 현명한 선택을",
    description: "더 나은 선택, 객관적인 정보 비교로부터. 알고투표는 정책과 비전을 쉽게 비교해 현명한 결정을 돕습니다.",
    url: "https://www.algovote.info/",
    siteName: "알고투표",
    images: [
      {
        url: "https://www.algovote.info/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "알고투표 - 정확한 정보를 바탕으로, 현명한 선택을",
    description: "정확한 정보를 바탕으로, 현명한 선택을",
    images: ["https://github.com/user-attachments/assets/ffd90d31-e90c-4cf7-844f-2c0bbdf448e"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="ko" className={`${inter.variable} ${roboto.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css" />
        <meta name="naver-site-verification" content="b05dd0da6b73ec650ac556e598e736a58bece17e" />
         {/* Google Analytics */}
         <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KQHZX5Y0BN"
          strategy="lazyOnload"
        />
        <Script id="ga4-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-KQHZX5Y0BN');
          `}
        </Script>
       {/* Hotjar */}
       <Script id="hotjar-analytics" strategy="lazyOnload">
          {`
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:6398749,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      </head>
      <body className="flex flex-col min-h-screen font-sans">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <FooterWrapper />
        <Analytics />
      </body>
    </html>
  )
} 