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
  {
    files: ["**/README.md"],
        rules: {
            "spellcheck/spell-checker": "off",
        },
    },
]);
