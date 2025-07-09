import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import pluginImport from "eslint-plugin-import";
import pluginA11y from "eslint-plugin-jsx-a11y";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginCSpell from "@cspell/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      js,
      "@typescript-eslint": tseslint.plugin,
      react: pluginReact,
      import: pluginImport,
      "jsx-a11y": pluginA11y,
      "react-hooks": pluginReactHooks,
      "@cspell": pluginCSpell,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          directory: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      ...prettierConfig.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "arrow-body-style": ["error", "as-needed"],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_", // optional: allow _ignored vars
          argsIgnorePattern: "^_", // optional: allow _ignored args
        },
      ],
      "react/jsx-filename-extension": [
        "warn",
        { extensions: [".jsx", ".tsx"] },
      ],
      "import/no-unresolved": "error",
      "import/no-duplicates": "error",
      "react/prop-types": "off",
      "react/no-this-in-sfc": "error",
      "no-useless-call": "error",
      "no-nested-ternary": "off",
      "no-useless-return": "error",
      "no-console": ["error", { allow: ["log", "warn", "error"] }],
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/require-await": "off",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["sibling", "parent"],
            "index",
            "unknown",
          ],
          pathGroups: [
            {
              pattern: "react|react-dom|react-router-dom",
              group: "external",
              position: "before",
            },
            {
              pattern: "components/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "utils/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "const/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "redux/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "selectors/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "images/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "style/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin", "external"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "prettier/prettier": [
        "error",
        {
          printWidth: 80,
          trailingComma: "es5",
          bracketSpacing: true,
          bracketSameLine: false,
          arrowParens: "always",
          endOfLine: "auto",
        },
      ],
    },
  },

  {
    ignores: [
      ".next",
      "public",
      "node_modules",
      "yarn.lock",
      "package-lock.json",
      "**/*.test.js",
      ".eslintrc.json",
      "package.json",
      "postcss.config.mjs",
      "next.config.mjs",
      "tailwind.config.js",
      "tailwind.config.ts",
      "appSchema.ts",
    ],
  },
]);
