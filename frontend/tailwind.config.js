/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#060B09',
          900: '#0B1411',
          850: '#0F1C18',
          800: '#142721',
          700: '#1C382F',
          600: '#264E41',
          500: '#10B981',
          400: '#34D399',
          300: '#6EE7B7',
          200: '#A7F3D0',
          100: '#D1FAE5',
        },
        obsidian: {
          950: '#050706',
          900: '#090D0C',
          850: '#0E1311',
          800: '#131A18',
          700: '#1D2724',
          600: '#2A3733',
        },
        threat: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#F97316',
          critical: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(16, 185, 129, 0.6)' },
        },
      },
      backgroundImage: {
        'forest-gradient': 'radial-gradient(ellipse at top, #142721 0%, #0B1411 45%, #060B09 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(20, 39, 33, 0.7) 0%, rgba(11, 20, 17, 0.85) 100%)',
        'danger-gradient': 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 28, 24, 0.9) 100%)',
      },
    },
  },
  plugins: [],
};
