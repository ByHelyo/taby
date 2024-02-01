import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
