const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
  createJoinFunction,
  createJoinImplementation,
  asGenerator,
  defaultJoinGenerator,
} = require('resolve-url-loader');

const imageDirectory = path.resolve('src/img');
const fontsDirectory = path.resolve('src/fonts');

// call default generator then append any additional paths
const pathGenerator = asGenerator(
  (item, ...rest) => [
    ...defaultJoinGenerator(item, ...rest),
    item.isAbsolute ? null
      : /\.(png|svg|jpg|jpeg|gif)$/.test(item.uri) ? imageDirectory
      : /\.(woff|woff2|eot|ttf|otf)$/.test(item.uri) ? fontsDirectory
      : null
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
    config.plugins.push( // currently only way I fond to get custom fonts loaded
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../src/fonts'),
            to: 'src/fonts'
          },
        ]}
      ),
    );
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
              join: joinSassAssets,
              debug: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
        ],
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'javascript/auto',
        use: 'file-loader',
        include: path.resolve(__dirname, '../src/img')
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: 'file-loader',
        type: 'asset/resource',
        include: path.resolve(__dirname, '../src/fonts')
      }
    );
    return config;
  },
}
