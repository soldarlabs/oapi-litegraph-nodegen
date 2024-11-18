/**
 * @file Script to bundle the example.js and dependencies into a single file for use in
 * the browser.
 */
import { build } from "esbuild";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

build({
  entryPoints: ["./example/example.js"],
  bundle: true,
  outdir: "./example/dist",
  platform: "browser",
  format: "esm",
  sourcemap: true,
  plugins: [polyfillNode()],
}).catch(() => process.exit(1));
