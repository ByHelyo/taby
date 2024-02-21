import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        index: new URL("./src/popup/popup.html", import.meta.url).pathname,
        settings: new URL("./src/popup/settings/settings.html", import.meta.url)
          .pathname,
        bookmark: new URL("./src/popup/bookmark/bookmark.html", import.meta.url)
          .pathname,
        background: new URL("./src/background/background.html", import.meta.url)
          .pathname,
      },
    },
  },
});
