import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import prettierConfig from "eslint-config-prettier";
import eslintJs from "@eslint/js";

export default tseslint.config(
  // Global ignores
  {
    ignores: ["node_modules/", "dist/", "build/", "coverage/", "*.md"],
  },
  
  // Base config for all JS/TS files
  eslintJs.configs.recommended,
  ...tseslint.configs.recommended,

  // Config for React files in client/
  {
    files: ["client/**/*.{ts,tsx}"],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      }
    },
    settings: {
      react: { version: "detect" }
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // For Vite/React 17+
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Config for server files
  {
    files: ["server/**/*.js", "*.cjs"], // include .cjs files at root
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  
  // Prettier config comes last
  prettierConfig
);
