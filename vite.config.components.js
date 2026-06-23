import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
        includePaths: [resolve(__dirname, "./packages/")],
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "uswds-core": resolve(__dirname, "./packages/uswds-core"),
      "uswds-fonts": resolve(__dirname, "./packages/uswds-fonts"),
      "usa-media-block": resolve(__dirname, "./packages/usa-media-block"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        globals: {
          lit: "lit",
        },
        format: "es",
      },
    },
  },
});
