/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/styles/**/*.css"],
  safelist: ["bg-red-600", "bg-yellow-400", "bg-green-600"],
  theme: {
    extend: {
      backgroundImage: {
        "page-bg": "url('./assets/wallpapers/stars.jpg')", // default wallpaper (Benjamin Voros / Unsplash)
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        pixel: ["Neopixel", "JetBrains Mono", "monospace"], // site titles
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
        // the Projects window's theme: rgb triplets set in index.css (.proj, .p-dark)
        p: {
          "fg": "rgb(var(--p-fg) / <alpha-value>)",
          "body": "rgb(var(--p-body) / <alpha-value>)",
          "muted": "rgb(var(--p-muted) / <alpha-value>)",
          "surface": "rgb(var(--p-surface) / <alpha-value>)",
          "side": "rgb(var(--p-side) / <alpha-value>)",
          "sunk": "rgb(var(--p-sunk) / <alpha-value>)",
          "raised": "rgb(var(--p-raised) / <alpha-value>)",
          "deep": "rgb(var(--p-deep) / <alpha-value>)",
          "line": "rgb(var(--p-line) / <alpha-value>)",
          "line2": "rgb(var(--p-line2) / <alpha-value>)",
          "line3": "rgb(var(--p-line3) / <alpha-value>)",
          "ok": "rgb(var(--p-ok) / <alpha-value>)",
          "warn": "rgb(var(--p-warn) / <alpha-value>)",
          "bad": "rgb(var(--p-bad) / <alpha-value>)",
          "ok-soft": "rgb(var(--p-ok-soft) / <alpha-value>)",
          "bad-soft": "rgb(var(--p-bad-soft) / <alpha-value>)",
          "pop": "rgb(var(--p-pop) / <alpha-value>)",
          "pop-text": "rgb(var(--p-pop-text) / <alpha-value>)",
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
