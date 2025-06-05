/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ['"Raleway"', 'sans-serif'],
      },
      colors: {
        glass: 'rgba(255, 255, 255, 0.1)',
      },
      animation: {
        fadeIn: 'fadeIn 1s ease forwards',
      },
    },
  },
  plugins: [],
}
