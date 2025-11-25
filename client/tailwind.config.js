/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        gibson: [
          'Poppins',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        dairy: ['Dancing Script', 'Brush Script MT', 'cursive', 'serif'],
      },
    },
  },
  plugins: [],
}
