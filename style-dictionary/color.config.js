const StyleDictionary = require("style-dictionary");
const { template } = require("lodash");
const fs = require('fs');
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
        format: "custom/format/color-map",
        filter: {
          attributes: {
            category: colorToken
          }
        }
      })),
    },
  },
})

USWDS_COLORS.registerFormat({
  name: 'custom/format/color-map',
  formatter: template(fs.readFileSync(`${__dirname  }/templates/scss-color-map.template`))
});

USWDS_COLORS.buildPlatform('scss/colors');