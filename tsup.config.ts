import { defineConfig } from "tsup";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  // entry: ['src/**/*.ts'],
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  minify: isProduction,
  clean: true,
  splitting: true,
  sourcemap: !isProduction,
  watch: !isProduction,
});
