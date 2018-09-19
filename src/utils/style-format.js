const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const helpers = require('handlebars-helpers');

const { trimLeft } = helpers.string();

const colorListTemplate =
`'{{meta.name}}': (
  {{#each props as |prop|}}
  {{#isObject prop.value}}
  {{> colorList meta=prop props=prop.value }}
  {{else}}
  '{{prop.name}}': {{prop.value}},
  {{/isObject}}  
  {{~/each}}
),
`;

const colorMap =
`\${{global.category}}: (
{{#each props as |prop|}}
  {{> colorList meta=prop props=prop.value }}
{{/each}}
);`;

handlebars.registerHelper('isObject', function (item, options) {
  if (typeof item === 'object') {
    return options.fn(this);
  }

  return options.inverse(this);
});
handlebars.registerPartial('colorList', colorListTemplate)

const colorMapTemplate = handlebars.compile(colorMap);

const format = (options) => {
  return new Promise((resolve, reject) => {
    fs.readFile(options.file, (err, buffer) => {
      if (err) {
        throw new Error(err);
        process.exit(1);
      }
  
      const file = JSON.parse(buffer);
      let output;
      
      try {
        output = options.template(file);
      } catch (error) {
        throw new Error(error);
        process.exit(1);
      }
      
      resolve(output);
    });
  });
};


format({
  file: path.resolve(__dirname, '../', 'data', 'colors', 'red.json'),
  template: colorMapTemplate,
})
.then((sass) => {
  //const o = sass.replace(/^(\r?\n|\r)|\s+\n/g, '');

  fs.writeFileSync(path.resolve(__dirname, '../', 'stylesheets', 'core', 'system-tokens', '_red.scss'), sass);
});
