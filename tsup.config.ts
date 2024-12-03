import { defineConfig } from "tsup";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/nodeGenerator.ts",
    "src/OpenAPINode.ts",
    "src/visualWidgets.ts",
    "src/widgets.ts",
    "src/utils/*.ts",
    "src/utils/optim/*.ts",
  ],
  format: ["esm", "cjs"],
  target: "es2020",
  dts: true,
  sourcemap: !isProduction,
  clean: true,
  outDir: "dist",
  skipNodeModulesBundle: true,
  splitting: true,
  treeshake: false,
  bundle: false,
  env: {
    NODE_ENV: process.env.NODE_ENV || "development"
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || "development")
  }
});
