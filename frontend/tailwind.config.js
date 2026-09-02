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
        zenith: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#061325',
        },
        industrial: {
          surface: '#090d16',
          panel: '#0f172a',
          elevated: '#162238',
          border: '#1e293b',
          'border-highlight': '#334155',
          accent: '#06b6d4',
          'accent-glow': '#0891b2',
          warning: '#f59e0b',
          success: '#10b981',
          danger: '#ef4444',
          muted: '#64748b',
          text: '#f8fafc',
          'text-secondary': '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      boxShadow: {
        'industrial': '0 0 0 1px rgba(30, 41, 59, 0.8), 0 4px 6px -1px rgba(0, 0, 0, 0.5)',
        'industrial-glow': '0 0 15px -3px rgba(6, 182, 212, 0.25)',
        'industrial-glow-emerald': '0 0 15px -3px rgba(16, 185, 129, 0.25)',
        'industrial-glow-amber': '0 0 15px -3px rgba(245, 158, 11, 0.25)',
      },
      backgroundImage: {
        'radial-grid': 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 80%)',
        'subtle-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
