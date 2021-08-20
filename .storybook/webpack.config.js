const path = require("path");

module.exports = ({ config, mode }) => {
  // Add twig support
  config.module.rules.push({
    test: /\.twig$/,
    loader: "twigjs-loader",
  });

  // Tell Storybook where your components live
  config.resolve.alias["components"] = path.resolve(
    __dirname,
    "src"
  );

  // Add scss support
  config.module.rules.push(
    {
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
    },
    {
      test: /.(jpe?g|png|svg)$/,
      loader: "url-loader",
      include: path.join(__dirname, "src/img")
    },
  );

  return config;
};
