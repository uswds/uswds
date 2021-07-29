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

    // Make whatever fine-grained changes you need
    config.module.rules.push({
        "test": /\.s(c|a)ss$/,
        "use": [{
          loader: 'lit-scss-loader',
            options: {
              minify: true, // defaults to false
            },
          },
          "sass-loader",
        ],
      });
    return config;
  },
}
