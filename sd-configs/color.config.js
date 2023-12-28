const colorTokens = require("../packages/uswds-tokens/colors")

module.exports = {
  source: ["packages/uswds-tokens/colors/*.json"],
  platforms: {
    "scss/category": {
      transformGroup: "scss",
      buildPath: "packages/uswds-core/src/styles/tokens/color/",
      files: colorTokens.map((tokenCategory) => ({
        destination: `_${tokenCategory}.scss`,
        format: "scss/map-deep",
        mapName: `system-color-${tokenCategory}`,
        filter: {
          attributes: {
            category: tokenCategory
          }
        }
      })),
    },
  },
}
