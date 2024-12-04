import { defineConfig } from "tsup";

// Retrieve the build environment.
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

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
  treeshake: false,
  bundle: false,
  env: {
    NODE_ENV,
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
  },
});
