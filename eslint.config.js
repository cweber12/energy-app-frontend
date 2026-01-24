import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";

// Use FlatCompat to support plugins that don't yet support flat config
const compat = new FlatCompat();

export default defineConfig([
  // JavaScript rules
  ...compat.extends("plugin:react/recommended"),
  ...compat.extends("plugin:@typescript-eslint/recommended"),
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: globals.browser,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
]);
