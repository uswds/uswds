const path = require("path");
const {
  createJoinFunction,
  createJoinImplementation,
  asGenerator,
  defaultJoinGenerator,
} = require("resolve-url-loader");

const imageDirectory = path.resolve("src/img");
const fontsDirectory = path.resolve("src/fonts");

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
  createJoinImplementation(pathGenerator)
);

module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        type: "json",
        use: "yaml-loader",
      },
      {
        test: /\.twig$/,
        use: "twig-loader",
      },
      {
        test: /\.s(c|a)ss$/i,
        "oneOf": [
          {
            "resourceQuery": /wc/, // foo.scss?wc
            "use": [{
              loader: 'lit-scss-loader',
                options: {
                  minify: true,
                },
              },
              "sass-loader",
            ],
          },
          {
            "use": ['style-loader', 'css-loader', 'sass-loader'],
            "include": path.resolve(__dirname, '../'),
          }
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "javascript/auto",
        use: {
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
          },
        },
        include: path.resolve(__dirname, "../src/img"),
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
        include: path.resolve(__dirname, "../src/fonts"),
      }
    );
    return config;
  },
};
