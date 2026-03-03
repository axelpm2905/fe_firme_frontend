/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#001f3f',
        'navy-dark': '#001529',
        'gray-text': '#6b7280',
        'gray-light': '#f3f4f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        verse: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      fontSize: {
        'fluid-lg': ['clamp(1.125rem, 2vw + 1rem, 1.5rem)', { lineHeight: '1.4' }],
        'fluid-xl': ['clamp(1.5rem, 3vw + 1rem, 2rem)', { lineHeight: '1.3' }],
        'fluid-2xl': ['clamp(2rem, 4vw + 1rem, 3rem)', { lineHeight: '1.2' }],
        'fluid-4xl': ['clamp(2rem, 5vw + 1.5rem, 3.75rem)', { lineHeight: '1.15' }],
      },
      minHeight: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      animation: {
        'slide-down': 'slideDown 0.2s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      safeArea: {
        'inset': 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    },
  },
  plugins: [],
}
