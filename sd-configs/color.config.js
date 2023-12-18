const StyleDictionary = require('style-dictionary');

const myStyleDictionary = StyleDictionary.extend({
  source: ["./packages/uswds-tokens/colors/color.json"],
  transform: {
    myTransform: {
      type: 'name',
      transformer: (token) => console.log(token)
    }
  },
  platforms: {
    scss: {
      transformGroup: "scss",
      buildPath: "packages/uswds-core/src/styles/tokens/color/",
      files: [{
        destination: "_TEST-settings-color.scss",
        format: "scss/variables",
        filter: {
          attributes: { "category": "theme"}
        },
        options: {
          outputReferences: false
        }
      }]
    }
  }
})

myStyleDictionary.buildPlatform('scss');
