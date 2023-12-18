// import tokens from "packages/uswds-tokens/colors/blue.json"
// const tokens = require("../packages/uswds-tokens/colors/blue.json");

const tokens = require("../packages/uswds-core/src/styles/tokens/color")

// const StyleDictionary = require('style-dictionary');

module.exports = {
  source: ["packages/uswds-tokens/colors/*.json"],
  platforms: {
    // scss: {
    //   transformGroup: "scss",
    //   buildPath: "packages/uswds-core/src/styles/tokens/color/",
    //   files: [
    //     {
    //       destination: "TEST-colors.scss",
    //       format: "scss/variables"
    //     },
    //   ],
    // },

    "scss/category": {
      transformGroup: "scss",
      buildPath: "packages/uswds-core/src/styles/tokens/color/",
      files: tokens.map((tokenCategory) => ({
        destination: `_${tokenCategory}.scss`,
        format: "scss/variables",
      })),
    },
  },
}
