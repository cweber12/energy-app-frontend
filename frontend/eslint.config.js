import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";

// Use FlatCompat to support plugins that don't yet support flat config
const compat = new FlatCompat();

export default defineConfig([
  // Base JavaScript recommended rules
  js.configs.recommended,

  // React and TypeScript plugin configs (via FlatCompat adapter)
  ...compat.extends("plugin:react/recommended"),
  ...compat.extends("plugin:react-hooks/recommended"),
  ...compat.extends("plugin:@typescript-eslint/recommended"),

  // Project-wide settings
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
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Not needed with the React 17+ JSX transform
      "react/react-in-jsx-scope": "off",
      // Prop-types validation is redundant when using TypeScript
      "react/prop-types": "off",
    },
  },

  // Jest globals for test files
  {
    files: ["**/*.test.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        test: "readonly",
        expect: "readonly",
        describe: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
      },
    },
  },
]);

