/** @type {import('tailwindcss').Config} */
export default {
  content:[
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "Poppins" : ['Poppins', 'sans-serif'],
        "Inter" : ['Inter', 'sans-serif'],
        "Oswald": ['Oswald', 'sans-serif']
      }
    },
  },
  plugins: [],
}

