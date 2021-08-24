const path = require("path");

module.exports = {
  "core": {
    "builder": "webpack5"
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "webpackFinal": async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    // TODO: Create a custom webpack.config.js if this gets too long
    // ? https://storybook.js.org/docs/react/configure/webpack#using-your-existing-config
    config.module.rules.push(
       {
        "test": /\\.s(c|a)ss$/,
        "oneOf": [
          {
            "resourceQuery": /wc/, // foo.scss?ts
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
            "resourceQuery": / /,
            "use": ['style-loader', 'css-loader', 'sass-loader'],
            "include": path.resolve(__dirname, '../'),
          }
        ],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../'),
      },
      {
        test: /.(jpe?g|png|svg)$/,
        loader: "url-loader",
        include: path.join(__dirname, "src/img")
      },
      {
        test: /\.twig$/,
        loader: "twig-loader",
      },
      {
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader'
      },
    );

    // Return the altered config
    return config;
  }
}
