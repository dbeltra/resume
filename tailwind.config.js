/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/styles/**/*.css"],
  safelist: ["bg-red-600", "bg-yellow-400", "bg-green-600"],
  theme: {
    extend: {
      backgroundImage: {
        "page-bg": "url('./assets/images/background.png')",
      },
      colors: {
        primary: {
          DEFAULT: "#a772a7",
          100: "#f5eff5",
          200: "#e2d0e2",
          300: "#ceb1ce",
          400: "#ba91ba",
          500: "#a772a7",
          600: "#8d588d",
          700: "#6e456e",
          800: "#4e314e",
          900: "#2f1d2f",
        },
        secondary: {
          DEFAULT: "#7094db",
          100: "#ebf0fa",
          200: "#c2d1f0",
          300: "#bbccee",
          400: "#7094db",
          500: "#4775d1",
          600: "#2e5cb8",
          700: "#24478f",
          800: "#193366",
          900: "#0f1f3d",
        },
      },
    },
  },
  plugins: [],
};
