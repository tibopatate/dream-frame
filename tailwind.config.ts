import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian:  '#080807',
        carbon:    '#11110F',
        graphite:  '#1D1C19',
        porcelain: '#F1EEE8',
        champagne: {
          DEFAULT: '#C7A77A',
          pale:    '#DFCCAB',
        },
        ash: '#8E8A82',
      },
      fontFamily: {
        // Poppins everywhere — toutes les variantes pointent vers Poppins
        poppins: ['var(--font-poppins)', 'sans-serif'],
        sans:    ['var(--font-poppins)', 'sans-serif'],
        serif:   ['var(--font-poppins)', 'sans-serif'],
        display: ['var(--font-poppins)', 'sans-serif'],
        mono:    ['var(--font-poppins)', 'sans-serif'], // ← Poppins remplace la monospace système
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'modern-glow': '0 10px 30px -10px rgba(255, 255, 255, 0.1)',
        'amber-glow':  '0 0 30px -5px rgba(251, 191, 36, 0.25)',
        'white-glow':  '0 0 40px -10px rgba(255, 255, 255, 0.15)',
      },
      keyframes: {
        shimmer: {
          '0%':   { transform: 'translateX(-150%) skewX(-20deg)' },
          '100%': { transform: 'translateX(250%) skewX(-20deg)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(251, 191, 36, 0.4)' },
          '50%':      { boxShadow: '0 0 20px 6px rgba(251, 191, 36, 0.7)' },
        },
        'hero-zoom': {
          from: { transform: 'scale(1.08)' },
          to:   { transform: 'scale(1.0)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        shimmer:      'shimmer 0.8s ease-in-out',
        'fade-up':    'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-up':   'slide-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'hero-zoom':  'hero-zoom 1.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'bounce-soft':'bounce-soft 2s ease-in-out infinite',
      },
      letterSpacing: {
        museum: '0.2em',
        wider:  '0.08em',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
