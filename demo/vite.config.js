import { defineConfig } from "vite";
import { resolve } from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ mode }) => ({
  plugins: [
    nodePolyfills({
      globals: {
        process: true,
        Buffer: true,
        global: true,
      },
      protocolImports: true,
    }),
  ],
  build: {
    sourcemap: mode === "development",
    minify: mode === "production",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      external: [
        "vite-plugin-node-polyfills/shims/buffer",
        "vite-plugin-node-polyfills/shims/process",
      ],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production",
      },
    },
  },
  optimizeDeps: {
    include: ["litegraph.js", "buffer", "process"],
    exclude: ["oapi-litegraph-nodegen"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  resolve: {
    alias: {
      buffer: "vite-plugin-node-polyfills/shims/buffer",
      process: "vite-plugin-node-polyfills/shims/process",
    },
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root.
      allow: [".."],
    },
    open: true,
    cors: true,
    sourcemap: true,
  },
}));