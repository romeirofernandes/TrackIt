/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green1: "#0B1414",
        green2: "#0F1C1C",
        green3: "#082D2D",
        green4: "#003B3B",
        green5: "#004848",
        green6: "#025757",
        green7: "#076969",
        green8: "#007F7F",
        green9: "#008080",
        green10: "#157070",
        green11: "#6BCDCC",
        green12: "#A2F0EF",
        trans: "#3E4747",
        trans2: "#5C6363",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
