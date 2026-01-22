/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        scan: {
          '0%': { left: '-20%' },
          '100%': { left: '120%' },
        }
      },
      animation: {
        'scan': 'scan 4s linear infinite',
      },
      colors: {
        brand: {
          DEFAULT: '#00478f',
          dark: '#003366',
          light: '#0059b3',
        },
        blue: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#4fc3f7', // light sky blue
          500: '#00a8ff', // bright sky blue
          600: '#0066cc', // bright medium
          700: '#00478f', // medium blue - current brand
          800: '#003366', // navy
          900: '#001122', // dark navy
          950: '#000a14', // darkest navy
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

