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
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

