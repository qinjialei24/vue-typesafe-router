import typescript from 'rollup-plugin-typescript2';
import { readFileSync } from 'fs';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import vue from 'rollup-plugin-vue'

const pkg = JSON.parse(readFileSync('./package.json'));

const input = 'src/index.ts';
const cjsOutput = { file: pkg.main, format: 'cjs', exports: 'auto' };
const esmOutput = { file: pkg.module, format: 'es' };
const dtsOutput = { file: pkg.types, format: 'es' };

export default [
  {
    input: "src/index.ts",
    external: ['vue', 'vue-router'],
    output: [
      {
        file: "dist/index.mjs",
        format: "esm",
        plugins: [terser()]
      },
      {
        format: 'cjs',
        file: 'dist/index.js',
        plugins: [terser()]
      }
    ],
    plugins: [vue(),
      typescript({
      check: false,
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          declarationMap: true,
        }
      }
      }),
    ]
  },
]