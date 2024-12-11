/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5EFE7",
        primary: "#4764B9",
        secondary: '#3C3C3C',
        accent: '#366B9D',
        action: '#366B9D',
        darkBlue: "#3B4D61",
        accent2: "#FFF600",
        black: "#252525",
        starColor1: "#FF6200",
        starColor2: "#FF8900",
        starColor3: "#FFA033",
        starColor4: "#FFB223",
        starColor5: "#FFC300",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}