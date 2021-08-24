const path = require("path");

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
    config.module.rules.push(
      {
        "test": /\.ya?ml$/,
        "type": 'json',
        "use": 'yaml-loader'
      },
      {
        "test": /\.s(c|a)ss$/,
        "use": [{
          loader: 'lit-scss-loader',
            options: {
              minify: true, // defaults to false
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /.(jpe?g|png|svg)$/,
        loader: "url-loader",
        include: path.join(__dirname, "src/img")
      },
    );
    return config;
  },
}
