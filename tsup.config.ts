import { defineConfig } from "tsup";

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

console.log(`Building for ${NODE_ENV}...`);

export default defineConfig({
  entry: ["src/**/*.ts"],
  format: ["esm", "cjs"],
  target: "es2020",
  dts: true,
  sourcemap: !isProduction,
  clean: true,
  outDir: "dist",
  skipNodeModulesBundle: true,
  splitting: true,
  treeshake: isProduction,
  bundle: false,
  env: {
    NODE_ENV,
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
  },
});
