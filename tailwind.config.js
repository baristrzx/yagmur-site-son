/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e6edf5',
          100: '#ccd9eb',
          200: '#99b4d7',
          300: '#668ec3',
          400: '#3369af',
          500: '#00439b',
          600: '#003680',
          700: '#002960',
          800: '#002147',
          900: '#001530',
        },
        royal: {
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c1ff',
          300: '#66a1ff',
          400: '#3382ff',
          500: '#0062ff',
          600: '#004fd9',
          700: '#003db3',
          800: '#002a8c',
          900: '#001866',
        },
        gold: {
          50: '#fdf9ed',
          100: '#faf3db',
          200: '#f5e7b7',
          300: '#f0db93',
          400: '#ebcf6f',
          500: '#e6c34b',
          600: '#c9a82e',
          700: '#a88c22',
          800: '#876f16',
          900: '#66530a',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
