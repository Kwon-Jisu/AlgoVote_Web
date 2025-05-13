/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3449FF", // 메인 컬러
        background: "#F5F7FA", // 배경 컬러
        "text-primary": "#1E1E1E", // 기본 텍스트
        "text-secondary": "#6B7280", // 보조 텍스트
        divider: "#E5E7EB", // 구분선/테두리
        highlight: "#FFC400", // 하이라이트 포인트
        success: "#22C55E", // 성공 알림
        error: "#EF4444", // 오류 알림
      },
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        DEFAULT: '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        'full': '9999px',
        'button': '8px',
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontWeight: 700, // Bold
              fontSize: '32px',
            },
            h2: {
              fontWeight: 600, // SemiBold
              fontSize: '24px',
            },
            h3: {
              fontWeight: 500, // Medium
              fontSize: '20px',
            },
            body: {
              fontWeight: 400, // Regular
              fontSize: '16px',
            },
            caption: {
              fontWeight: 300, // Light
              fontSize: '12px',
            },
          },
        },
      },
      maxWidth: {
        'content': '1200px', // 최대 컨텐츠 폭
      },
      boxShadow: {
        'card': '0px 2px 4px rgba(0,0,0,0.05)',
        'card-hover': '0px 4px 8px rgba(0,0,0,0.05)',
      },
      spacing: {
        'column-gap': '24px', // Column 간격
        'vertical-gap': '80px', // 콘텐츠 간 수직 여백
      },
      keyframes: {
        'float-up': {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(-20px)', opacity: 0 }
        },
        'float-up-left': {
          '0%': { transform: 'translate(0, 0)', opacity: 1 },
          '100%': { transform: 'translate(-10px, -20px)', opacity: 0 }
        },
        'float-up-right': {
          '0%': { transform: 'translate(0, 0)', opacity: 1 },
          '100%': { transform: 'translate(10px, -20px)', opacity: 0 }
        },
      },
      animation: {
        'float-up': 'float-up 1.5s ease-out forwards',
        'float-up-left': 'float-up-left 1.5s ease-out forwards',
        'float-up-right': 'float-up-right 1.5s ease-out forwards',
      },
      transitionDelay: {
        '75': '75ms',
        '150': '150ms',
        '225': '225ms',
        '300': '300ms',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

