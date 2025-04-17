/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          teal: '#2B6A6E',
          coral: '#FF6F61',
          slate: '#2D3748',
          lightSlate: '#A0AEC0',
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
        },
      },
    },
    plugins: [],
  }