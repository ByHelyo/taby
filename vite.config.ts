import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        index: new URL("./src/popup/popup.html", import.meta.url).pathname,
        background: new URL("./src/background/background.html", import.meta.url)
          .pathname,
      },
    },
  },
});
