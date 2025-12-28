/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        examhub: { blue: '#1579de', orange: '#ec8626', green: '#1d6d1f' }
      }
    },
  },
  plugins: [],
}