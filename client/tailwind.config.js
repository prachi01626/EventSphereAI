/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f3f8f5',
          100: '#e3eee7',
          200: '#c8ded2',
          300: '#a3c7b5',
          400: '#76aa93',
          500: '#548e77',
          600: '#3f715e',
          700: '#345a4c',
          800: '#2c493e',
          900: '#253d34',
          950: '#14221d',
        },
        forest: {
          dark: '#1b2920',
          charcoal: '#23342a',
          olive: '#2d4336',
          accent: '#3e6350',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 10px 30px -5px rgba(35, 60, 45, 0.07)',
        'glass-hover': '0 20px 40px -12px rgba(35, 60, 45, 0.15)',
        'pill': '0 4px 16px 0 rgba(30, 48, 38, 0.25)',
      }
    },
  },
  plugins: [],
}
