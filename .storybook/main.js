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

    // SCSS configuration: override asset paths to use staticDirs-served paths.
    // The default $theme-image-path: "../img" resolves relative to source SCSS
    // files, which don't have assets next to them. By overriding to absolute
    // paths, we rely on staticDirs serving dist/ at the root.
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
          additionalData:
            '$theme-image-path: "/img";\n$theme-font-path: "/fonts";\n',
        },
      },
    };

    // Ensure twig (CJS-only) is pre-bundled for browser use in dev mode
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [...(config.optimizeDeps?.include || []), "twig"],
    };

    // Configure Rollup's commonjs plugin for production builds.
    config.build = {
      ...config.build,
      commonjsOptions: {
        ...config.build?.commonjsOptions,
        defaultIsModuleExports: true,
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
