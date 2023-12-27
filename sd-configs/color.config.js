const colors = require("../packages/uswds-tokens/colorsSD")

module.exports = {
  source: ["packages/uswds-tokens/colorsSD/**/*.json"],
  platforms: {
    "scss/category": {
      transformGroup: "scss",
      buildPath: "packages/uswds-core/src/styles/tokens/colorSD/",
      files: colors.map((tokenCategory) => ({
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
