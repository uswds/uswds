const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');

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
    config.output.publicPath = 'auto',
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
          // "extract-loader", // TODO: get working
          // "css-loader",
          // {
          //   loader: "css-loader",
          //   options: {
          //     esModule: false,
          //   },
          // },
          {
            loader: 'postcss-sass-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-preset-env')(), // includes autoprefixer
              ]
            }
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: "asset/resource",
        include: path.join(__dirname, "../src")
      },
      // {
      //   test: /.(jpe?g|png|svg)$/,
      //   loader: "url-loader",
      //   type: "javascript/auto",
      //   include: path.join(__dirname, "src/img")
      // },
    );
    return config;
  },
}
