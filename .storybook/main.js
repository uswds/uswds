const path = require("path");
const {
  createJoinFunction,
  createJoinImplementation,
  asGenerator,
  defaultJoinGenerator,
} = require("resolve-url-loader");

const imageDirectory = path.resolve("dist/img");
const fontsDirectory = path.resolve("dist/fonts");

// call default generator then append any additional paths
const pathGenerator = asGenerator((item, ...rest) => [
  ...defaultJoinGenerator(item, ...rest),
  item.isAbsolute
    ? null
    : /\.(png|svg|jpg|jpeg|gif)$/.test(item.uri)
      ? imageDirectory
      : /\.(woff|woff2|eot|ttf|otf)$/.test(item.uri)
        ? fontsDirectory
        : null,
]);

const joinSassAssets = createJoinFunction(
  "joinSassAssets",
  createJoinImplementation(pathGenerator),
);

module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: [
    "../packages/**/*.stories.mdx",
    "../packages/**/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
  ],
  staticDirs: ["../dist"],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    config.module.rules.push(
      {
        test: /\.twig$/,
        use: "twigjs-loader",
        resolve: {
          alias: {
            "@components": path.resolve(__dirname, "../packages"),
            "@templates": path.resolve(__dirname, "../packages/templates"),
          },
        },
      },
      {
        test: /\.s(c|a)ss$/i,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              esModule: false,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              postcssOptions: (loaderContext) => {
                return {
                  plugins: [
                    ["postcss-import", { root: loaderContext.resourcePath }],
                    ["postcss-discard-comments", { removeAll: true }],
                    "postcss-preset-env",
                    [
                      "postcss-csso",
                      { forceMediaMerge: false, comments: false },
                    ],
                  ],
                };
              },
            },
          },
          {
            loader: "resolve-url-loader",
            options: {
              join: joinSassAssets,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                loadPaths: ["./packages", "./node_modules/@uswds"],
                implementation: require("sass-embedded"),
              },
            },
          },
        ],
        include: path.resolve(__dirname, "../packages"),
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "javascript/auto",
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            //outputPath: "../dist/img",
          },
        },
        include: path.resolve(__dirname, "../packages"),
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "javascript/auto",
        use: {
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
          },
        },
        include: path.resolve(
          __dirname,
          "../packages/uswds-core/src/assets/fonts",
        ),
      },
    );

    return config;
  },
};
