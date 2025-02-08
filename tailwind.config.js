/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        primary: '#0C1421',
        accent: '#70B9F2',
        light: '#F7F7F7',
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(135deg, rgba(112, 183, 242, 0.7) 20%, rgba(59, 99, 168, 0.8) 50%, rgba(12, 20, 33, 0.9) 100%)',
      },
    },
  },
  plugins: [],
}
