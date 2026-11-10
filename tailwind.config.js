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
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
      },
      colors: {
        // v2 dark surfaces (apps) and light page (browser content)
        ink: {
          950: "#0d0f13",
          900: "#10131a",
          850: "#12151c",
          800: "#151820",
          700: "#1b1f29",
          600: "#232836",
          500: "#262b36",
          400: "#2c3240",
          muted: "#9aa3b2",
          soft: "#c9ced8",
          text: "#e6e8ec",
        },
        lilac: { DEFAULT: "#b98ab9", text: "#c49bc4" },
        peri: "#7f9fe0",
        mint: "#6fbf8a",
        honey: { DEFAULT: "#e0a46e", gate: "#d4a72c" },
        paper: { DEFAULT: "#f6f5f8", line: "#e3e0ea", tint: "#ebe5f2" },
        plum: {
          DEFAULT: "#8e3f8e",
          dark: "#5e2a5e",
          text: "#3d3a48",
          muted: "#6a6577",
        },
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
