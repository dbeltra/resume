import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginTailwindCSS from "eslint-plugin-tailwindcss";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { ignores: ["build/**"] },
  {
    languageOptions: {
      // CRA inlines process.env at build time
      globals: { ...globals.browser, ...globals.es2021, process: "readonly" },
    },
    settings: { react: { version: "detect" } },
  },
  {
    files: ["**/*.test.js", "src/setupTests.js"],
    languageOptions: { globals: globals.jest },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  ...eslintPluginTailwindCSS.configs["flat/recommended"],
  {
    // jsx-a11y is registered so the existing disable comments resolve
    plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "off", // no PropTypes in this project, same as CRA
    },
  },
];
