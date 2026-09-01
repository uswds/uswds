const path = require("path");

const packagesDir = path.resolve(__dirname, "../packages");
const templatesDir = path.resolve(__dirname, "../packages/templates");

/** @type { import('@storybook/html-vite').StorybookConfig } */
module.exports = {
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  stories: ["../packages/**/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-a11y"],
  staticDirs: ["../dist"],
  async viteFinal(config) {
    // Dynamically import the ESM plugins (CJS config can't use static import)
    const { default: twigPlugin } = await import(
      "../tasks/vite-plugin-twig.mjs"
    );
    const { default: uswdsCjsPlugin } = await import(
      "../tasks/vite-plugin-uswds-cjs.mjs"
    );

    // Register plugins for .twig compilation and CJS→ESM transform
    config.plugins = config.plugins || [];
    config.plugins.push(
      uswdsCjsPlugin({ packagesDir }),
      twigPlugin({
        namespaces: {
          "@components": packagesDir,
          "@templates": templatesDir,
        },
      }),
    );

    // SCSS configuration. The USWDS defaults $theme-image-path: "../img" and
    // $theme-font-path: "../fonts" emit relative url()s in the compiled CSS.
    // Vite rebases those relative to the emitted CSS file (_site/assets/), so
    // they resolve to _site/img and _site/fonts — which is where staticDirs
    // ("../dist") serves them. Because the URLs stay relative, they also resolve
    // correctly when Storybook is deployed under a non-root path (e.g. the
    // cloud.gov preview URL).
    config.css = {
      ...config.css,
      preprocessorOptions: {
        ...config.css?.preprocessorOptions,
        scss: {
          ...config.css?.preprocessorOptions?.scss,
          api: "modern-compiler",
          loadPaths: [
            packagesDir,
            path.resolve(__dirname, "../node_modules/@uswds"),
          ],
        },
      },
    };

    // Resolve aliases for non-.twig imports
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@components": packagesDir,
        "@templates": templatesDir,
      },
    };

    return config;
  },
};
