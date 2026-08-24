import { resolve } from "node:path";
import { defineConfig } from "vite";
import VitePluginSvgSpritemap from "@spiriit/vite-plugin-svg-spritemap";
import commonjs from "@rollup/plugin-commonjs";
import svgoConfig from "./svgo.config";

const paths = {
  in: {
    img: "packages/usa-icon/src/img/**/*.svg",
  },
  out: {
    img: "dist/img",
  },
};

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        loadPaths: ["./packages"],
      },
    },
  },

  build: {
    rollupOptions: {
      input: {
        "uswds.js": resolve(__dirname, "packages/uswds-core/src/js/index.js"), // Your JS entry point
        "uswds.css": resolve(__dirname, "src/stylesheets/uswds.scss"), // Your SCSS entry point
      },
      output: {
        manualChunks: false,
      },
    },
  },
  plugins: [
    commonjs(),
    VitePluginSvgSpritemap(paths.in.img, {
      prefix: "",
      output: {
        filename: "img/sprite.svg",
      },
      svgo: svgoConfig,
    }),
  ],
});
