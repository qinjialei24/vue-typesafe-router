import js from "@eslint/js";
import eslintPluginVue from "eslint-plugin-vue";
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
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      // 在这里添加TypeScript文件的自定义规则
    },
  },
  // 全局规则
  {
    rules: {
      // 在这里添加适用于所有文件的全局规则
    },
  },
];
