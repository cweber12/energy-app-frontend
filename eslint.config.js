const js = require("@eslint/js");
const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const { FlatCompat } = require("@eslint/eslintrc");
const { defineConfig } = require("eslint/config");

// Use FlatCompat to support plugins that don't yet support flat config
const compat = new FlatCompat();

module.exports = defineConfig([
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
    // Remove plugins property here
    rules: {
      // Add your custom rules here
    },
  },
]);
