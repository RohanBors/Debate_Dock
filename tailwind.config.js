/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        council: {
          bg: '#0a0a0f',
          surface: '#13131a',
          card: '#1a1a24',
          border: '#2a2a3a',
          accent: '#6c63ff',
          'accent-glow': '#8b83ff',
          gold: '#f5c842',
          'gold-dim': '#c9a227',
          text: '#e8e8f0',
          muted: '#7a7a9a',
          success: '#4ade80',
          free: '#34d399',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'council-glow': 'radial-gradient(ellipse at top, #1a1040 0%, #0a0a0f 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
