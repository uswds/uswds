const StyleDictionary = require("style-dictionary");
const _ = require("lodash");
const fs = require('fs');
const colorTokens = require("../packages/uswds-tokens/colors")

const USWDSTokens = StyleDictionary.extend({
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

const USWDSVars = StyleDictionary.extend({
  source: ["packages/uswds-tokens/colors/*.json"],
  platforms: {
    "css": {
      transformGroup: "css",
      buildPath: "packages/uswds-core/src/styles/tokens/color/",
      files: [
        {
          format: "css/variables",
          destination: "color.css",
          options: {
            outputReferences: true
          }
        }
      ]
    }
  }
})

USWDSTokens.registerFormat({
  name: 'custom/format/color-map',
  formatter: _.template(fs.readFileSync(`${__dirname  }/templates/scss-color-map.template`))
});

USWDSTokens.buildPlatform('scss/colors');
USWDSVars.buildPlatform('css');
