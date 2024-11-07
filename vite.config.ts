import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true, // add all types to one file
      exclude: ["src/**/*.test.ts","src/**/*.*-d.ts"],
    }),
  ],
  build: {
    minify: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueTypesafeRouter",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vue", "vue-router"],
      output: {
        globals: {
          vue: "Vue",
          "vue-router": "VueRouter",
        },
      },
    },
  },
});
