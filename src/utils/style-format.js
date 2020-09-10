const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const helpers = require("handlebars-helpers");

const { trimLeft } = helpers.string();

const colorListTemplate = `'{{meta.name}}': (
  {{#each props as |prop|}}
  {{#isObject prop.value}}
  {{> colorList meta=prop props=prop.value }}
  {{else}}
  {{toNumber prop.name}}: {{prop.value}},
  {{/isObject}}  
  {{~/each}}
),
`;

const colorMap = `\${{global.category}}: (
{{#each props as |prop|}}
  {{> colorList meta=prop props=prop.value }}
{{/each}}
);`;

handlebars.registerHelper("toNumber", function (item, options) {
  const maybeNumber = Number(item);
  let output;

  if (isNaN(maybeNumber)) output = item;

  output = maybeNumber;

  return output;
});

handlebars.registerHelper("isObject", function (item, options) {
  if (typeof item === "object") {
    return options.fn(this);
  }

  return options.inverse(this);
});
handlebars.registerPartial("colorList", colorListTemplate);

const colorMapTemplate = handlebars.compile(colorMap);

const format = (options) => {
  return new Promise((resolve, reject) => {
    fs.readFile(options.file, (err, buffer) => {
      if (err) {
        throw new Error(err);
      }

      const data = JSON.parse(buffer);
      let output = {
        output: options.output,
        file: options.file,
      };

      try {
        output = { data: options.template(data), ...output };
      } catch (error) {
        throw new Error(error);
      }

      resolve(output);
    });
  });
};

const generateFilename = (filePath) =>
  `_${path.basename(filePath).split(".")[0]}.scss`;
const resolvePath = (pathString) =>
  path.resolve.apply(null, pathString.split("/"));
const isDirectory = (maybeDir) => fs.lstatSync(maybeDir).isDirectory();

const writeSassFile = (sass) => {
  const { output, file, data } = sass;
  const finalOutput = `${output}/${generateFilename(file)}`;
  fs.writeFileSync(resolvePath(finalOutput), data);
};

const argv = require("yargs").argv;
const ARGS = {
  FILE: "file",
  OUTPUT: "output",
  TEMPLATE: "template",
};

const rawFilePath = argv[ARGS.FILE];
const rawOutputPath = argv[ARGS.OUTPUT];
const template = argv[ARGS.TEMPLATE] || colorMapTemplate;

if (!rawFilePath || !rawOutputPath) {
  throw new Error(
    `Both --file and --output paths must be provided as arguments to style-format`
  );
}

if (isDirectory(rawFilePath)) {
  fs.readdir(rawFilePath, (err, files) => {
    if (err) throw new Error();

    Promise.all(
      files.map((file) => {
        const filePath = resolvePath(`${rawFilePath}/${file}`);
        return format({
          file: filePath,
          output: rawOutputPath,
          template: colorMapTemplate,
        });
      })
    )
      .then((values) => values.forEach(writeSassFile))
      .catch((err) => console.log(err));
  });
} else {
  format({
    file: resolvePath(rawFilePath),
    output: rawOutputPath,
    template: colorMapTemplate,
  }).then(writeSassFile);
}
