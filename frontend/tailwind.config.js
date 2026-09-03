/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Vercel Geist Core Design Tokens
        bg: {
          DEFAULT: '#fafafa',
          subtle: '#f5f5f5',
        },
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#ffffff',
          sunken: '#fafafa',
          overlay: '#ffffff',
          hover: '#f5f5f5',
        },
        text: {
          primary: '#171717',
          secondary: '#4d4d4d',
          muted: '#8f8f8f',
          disabled: '#a1a1a1',
        },
        border: {
          DEFAULT: '#ebebeb',
          strong: '#d4d4d4',
          subtle: '#f2f2f2',
          highlight: '#0070f3',
        },
        // Semantic Restrained State Tokens
        industrial: {
          success: {
            DEFAULT: '#0e703c',
            muted: '#e6f7ed',
            subtle: 'rgba(14, 112, 60, 0.08)',
            border: '#a3e3bc',
          },
          warning: {
            DEFAULT: '#ab570a',
            muted: '#fff8e6',
            subtle: 'rgba(171, 87, 10, 0.08)',
            border: '#ffd98a',
          },
          error: {
            DEFAULT: '#c50000',
            muted: '#fde8e8',
            subtle: 'rgba(197, 0, 0, 0.08)',
            border: '#f8b4b4',
          },
          info: {
            DEFAULT: '#0070f3',
            muted: '#e8f2ff',
            subtle: 'rgba(0, 112, 243, 0.08)',
            border: '#a8cdfe',
          },
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        'industrial': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'industrial-elevated': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'industrial-subtle': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'glow-info': 'none',
        'glow-success': 'none',
        'glow-warning': 'none',
        'glow-error': 'none',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'fade-in': 'fade-in 0.15s ease-out',
        'slide-down': 'slide-down 0.15s ease-out',
      },
    },
  },
  plugins: [],
}
