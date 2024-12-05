import { defineConfig } from "tsup";

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

console.log(`Building for ${NODE_ENV}...`);

export default defineConfig({
  entry: ["src/**/*.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: !isProduction,
  clean: true,
  outDir: "dist",
  skipNodeModulesBundle: true,
  bundle: false,
  env: {
    NODE_ENV,
  },
  // Replace env variables to avoid undefined values in the bundle.
  define: {
    "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
  },
});
