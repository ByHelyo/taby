import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env": {},
  },
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, "dist"),
    lib: {
      formats: ["iife"],
      entry: resolve(__dirname, "./src/content-scripts/index.ts"),
      name: "Taby",
    },
    rollupOptions: {
      output: {
        entryFileNames: "index.global.js",
        extend: true,
      },
    },
  },
});
