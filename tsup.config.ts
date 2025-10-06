import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['cjs', 'esm'],     
  dts: true,
  clean: true,
  shims: true,
  skipNodeModulesBundle: true,
  outDir: 'dist',
  esbuildOptions(options, ctx) {
    if (ctx.format === 'esm') {
      options.outExtension = { '.js': '.mjs' };
    } else if (ctx.format === 'cjs') {
      options.outExtension = { '.js': '.cjs.js' };
    }
  }
});