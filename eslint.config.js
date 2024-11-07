import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.ts"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        window: true,
      },
    },
    env: {
      browser: true,
      node: false,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
  {
    rules: {
      // 全局规则
    },
  },
];
