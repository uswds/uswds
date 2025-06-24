import StyleDictionary from 'style-dictionary';

StyleDictionary.registerTransform({
  name: 'name/add-type',
  type: 'name',
  transform: function(token, options) {
    const baseName = [].concat(token.path).join('-');
    
    if (token.$type) {
      const nameWithType = `${token.$type}-${baseName}`;
      return options.prefix ? `${options.prefix}-${nameWithType}` : nameWithType;
    }
    return [options.prefix].concat(token.path).join('-')
  }
});


export default {
  "source": ["tokens/**/*.json"],
  "platforms": {
    "scss": {
      "transformGroup": "scss",
      "transforms": ["name/add-type"],
      "prefix": "usa",
      "buildPath": "build/scss/",
      "files": [
        {
          "destination": "_tokens.scss",
          "format": "scss/variables"
        }
      ],
    },
    "css": {
      "transformGroup": "css",
      "transforms": ["name/add-type"],
      "prefix": "usa",
      "buildPath": "build/css/",
      "files": [
        {
          "destination": "tokens.css",
          "format": "css/variables"
        }
      ]
    }
  }
}
