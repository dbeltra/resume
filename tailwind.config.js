/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "page-bg": "url('./assets/images/background.png')",
      },
      colors: {
        primary: "#a7a",
        secondary: "#bce",
      },
    },
  },
  plugins: [],
};
