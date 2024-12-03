import { defineConfig } from "tsup";

const isProduction = process.env.NODE_ENV === "production";
const isWatch = process.argv.includes("--watch");

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/nodeGenerator.ts",
    "src/OpenAPINode.ts",
    "src/visualWidgets.ts",
    "src/widgets.ts",
    "src/utils/*.ts"
  ],
  format: ["esm", "cjs"],
  target: "es2020",
  dts: true,
  sourcemap: !isProduction,
  clean: !isWatch,  // Don't clean in watch mode
  outDir: "dist",
  skipNodeModulesBundle: true,
  splitting: true,
  treeshake: false,
  bundle: false,
  watch: isWatch,
  onSuccess: isWatch 
    ? "echo '\nWatching for changes...'" 
    : undefined,
  env: {
    NODE_ENV: process.env.NODE_ENV || "development"
  }
});
