import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
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
  resolve: {
    alias: {
      buffer: "vite-plugin-node-polyfills/shims/buffer",
      process: "vite-plugin-node-polyfills/shims/process",
      "@": resolve(__dirname, "./src"),
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
