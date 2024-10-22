const StyleDictionary = require("style-dictionary");
const getJSON = require("./utils/getJSON");

const colorTokens = getJSON("./packages/uswds-tokens/colors");

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
          themeable: false,
        },
        filter: {
          attributes: {
            category: colorToken
          }
        }
      })),
    },
  },
})

USWDS_COLORS.buildPlatform('scss/colors');
