import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import { FlatCompat } from "@eslint/eslintrc";

// Use FlatCompat to support plugins that don't yet support flat config
const compat = new FlatCompat();

export default [
  // Base JavaScript recommended rules
  js.configs.recommended,

  // React and TypeScript plugin configs (via FlatCompat adapter)
  ...compat.extends("plugin:react/recommended"),
  ...compat.extends("plugin:react-hooks/recommended"),
  ...compat.extends("plugin:@typescript-eslint/recommended"),
  ...compat.extends("plugin:import/recommended"),
  ...compat.extends("plugin:testing-library/react"),

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
      // TypeScript handles module resolution — no need for eslint-import-resolver-typescript
      "import/no-unresolved": "off",
      "import/named": "off",
      "import/namespace": "off",
      "import/default": "off",
      "import/export": "off",
      // Non-null assertions are used intentionally in this codebase
      "@typescript-eslint/no-non-null-assertion": "off",
      // Allow _-prefixed variables to be unused (intentional discard pattern)
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_",
      }],
    },
  },

  // CRA setup file — needs CommonJS + Node globals
  {
    files: ["**/setupTests.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-empty-function": "off",
      "no-undef": "off",
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
    rules: {
      // Empty functions are common and valid in test mocks
      "@typescript-eslint/no-empty-function": "off",
    },
  },
];

