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
        // Core Zenith Design Tokens
        bg: {
          DEFAULT: '#080b12',
          subtle: '#06090f',
        },
        surface: {
          DEFAULT: '#0d1322',
          elevated: '#131b2e',
          sunken: '#06090f',
          overlay: '#172138',
          hover: '#19243d',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
          muted: '#64748b',
          disabled: '#475569',
        },
        border: {
          DEFAULT: '#1e293b',
          strong: '#334155',
          subtle: '#141d2e',
          highlight: '#38bdf8',
        },
        // Semantic Industrial State Tokens
        industrial: {
          success: {
            DEFAULT: '#10b981',
            muted: '#064e3b',
            subtle: 'rgba(16, 185, 129, 0.1)',
            border: '#047857',
          },
          warning: {
            DEFAULT: '#f59e0b',
            muted: '#78350f',
            subtle: 'rgba(245, 158, 11, 0.1)',
            border: '#b45309',
          },
          error: {
            DEFAULT: '#ef4444',
            muted: '#7f1d1d',
            subtle: 'rgba(239, 68, 68, 0.1)',
            border: '#b91c1c',
          },
          info: {
            DEFAULT: '#06b6d4',
            muted: '#164e63',
            subtle: 'rgba(6, 182, 212, 0.1)',
            border: '#0e7490',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      boxShadow: {
        'industrial': '0 0 0 1px rgba(30, 41, 59, 0.8), 0 4px 6px -1px rgba(0, 0, 0, 0.5)',
        'industrial-elevated': '0 0 0 1px rgba(51, 65, 85, 0.8), 0 10px 15px -3px rgba(0, 0, 0, 0.7)',
        'industrial-subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'glow-info': '0 0 15px -3px rgba(6, 182, 212, 0.3)',
        'glow-success': '0 0 15px -3px rgba(16, 185, 129, 0.3)',
        'glow-warning': '0 0 15px -3px rgba(245, 158, 11, 0.3)',
        'glow-error': '0 0 15px -3px rgba(239, 68, 68, 0.3)',
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
