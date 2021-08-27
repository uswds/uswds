const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const {
  createJoinFunction,
  createJoinImplementation,
  asGenerator,
  defaultJoinGenerator,
} = require('resolve-url-loader');

const themeDirectory = path.resolve('src/img');

// call default generator then append any additional paths
const pathGenerator = asGenerator(
  (item, ...rest) => [
    ...defaultJoinGenerator(item, ...rest),
    item.isAbsolute ? null : themeDirectory,
  ]
);

const joinSassAssets = createJoinFunction(
  'joinSassAssets',
  createJoinImplementation(pathGenerator),
);

module.exports = {
  "core": {
    "builder": "webpack5",
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    config.output.publicPath = '/',
    config.optimization.minimize = true,
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    config.module.rules.push(
      {
        "test": /\.ya?ml$/,
        "type": 'json',
        "use": 'yaml-loader'
      },
      {
        "test": /\.s(c|a)ss$/i,
        "use": [{
          loader: 'lit-scss-loader',
            options: {
              minify: true,
            },
          },
          "extract-loader",
          {
            loader: "css-loader",
            options: {
              url: true,
              esModule: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: (loaderContext) => {
                return {
                  plugins: [
                    ['postcss-import', { root: loaderContext.resourcePath }],
                    "postcss-preset-env",
                  ],
                }
              }
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              join: joinSassAssets
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
        ],
      },
      {
      test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
      type: 'javascript/auto',
      use: 'url-loader'
      },
    );
    return config;
  },
}
