const StyleDictionary = require("style-dictionary");
const getFileNames = require("./utils/getFileNames");

const colorTokenJSONPath = "./packages/uswds-tokens/colors"
const colorTokens = getFileNames(colorTokenJSONPath);

const USWDS_COLORS = StyleDictionary.extend({
  source: ["packages/uswds-tokens/colors/*.json"],
  platforms: {
    "scss/colors": {
      transformGroup: "scss",
      buildPath: "packages/uswds-core/src/styles/tokens/color/",
      files: colorTokens.map((colorToken) => ({
        destination: `_${colorToken}.scss`,
        mapName: `system-color-${colorToken}`,
        format: "scss/map-deep",
        options: {
          // Prevents system settings from being overridable. 
          // Removing or setting to true will add !default to the output token scss vars
          themeable: false,
          fileHeader: (defaultMessage) => [
            `This file was generated from ${colorTokenJSONPath}/${colorToken}.json`,
            ...defaultMessage,
          ]
        },
        filter: {
          attributes: {
            // This filter makes it so each output scss file only contains the relevant color
            // token and not a map of all the tokens combined.
            category: colorToken
          }
        }
      })),
    },
  },
})

USWDS_COLORS.buildPlatform('scss/colors');
