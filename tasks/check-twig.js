const fs = require("fs");
const path = require("path");
const Twig = require("twig");
const merge = require("lodash.merge");

const packagesDir = path.resolve(__dirname, "../packages");
const templatesDir = path.join(packagesDir, "templates");
const contentDir = "content";

Twig.cache(false);

function existsSync(filepath) {
  try {
    fs.accessSync(filepath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function buildModifierData(dataSource) {
  if (dataSource.includes("--")) {
    const rootDataFile = dataSource.replace(/--[\s\S]*$/, ".json");
    return merge(
      JSON.parse(fs.readFileSync(rootDataFile, "utf-8")),
      JSON.parse(fs.readFileSync(dataSource, "utf-8")),
    );
  }
  if (dataSource.includes("~")) {
    const rootDataFile = dataSource.replace(/~[\s\S]*$/, ".json");
    return merge(
      JSON.parse(fs.readFileSync(rootDataFile, "utf-8")),
      JSON.parse(fs.readFileSync(dataSource, "utf-8")),
    );
  }
  return JSON.parse(fs.readFileSync(dataSource, "utf-8"));
}

function buildFileObj(dir, file, dataFile) {
  const dataFilePath = dataFile ? `${dir}/${dataFile}` : null;
  const data =
    dataFilePath && existsSync(dataFilePath) ? buildModifierData(dataFilePath) : {};
  return { template: file, templateParameters: data };
}

function walk(dir, ext) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((entry) => {
    const file = `${dir}/${entry}`;
    const stat = fs.statSync(file);
    if (stat.isDirectory() && !path.basename(file).startsWith("_")) {
      results = results.concat(walk(file, ext));
    } else if (
      !stat.isDirectory() &&
      path.extname(file) === ext &&
      !path.basename(file).startsWith("_")
    ) {
      const dataDir = list.includes(contentDir) ? `${dir}/${contentDir}/` : dir;
      const allData = fs
        .readdirSync(dataDir)
        .filter((f) => f.endsWith(".json"));

      if (allData.length > 0) {
        allData.forEach((d) => results.push(buildFileObj(dataDir, file, d)));
      } else {
        results.push(buildFileObj(dataDir, file));
      }
    }
  });
  return results;
}

const files = walk("./packages", ".twig");

const failures = [];
for (const file of files) {
  try {
    Twig.twig({
      allowInlineIncludes: true,
      rethrow: true,
      namespaces: {
        components: `${packagesDir}/`,
        templates: `${templatesDir}/`,
      },
      data: fs.readFileSync(file.template, "utf-8"),
      path: file.template,
    }).render(file.templateParameters);
  } catch (err) {
    failures.push({ template: file.template, message: err.message });
  }
}

if (failures.length > 0) {
  for (const f of failures) {
    console.error(`✘ ${f.template}\n  ${f.message}\n`);
  }
  console.error(`${failures.length} of ${files.length} templates failed to render`);
  process.exit(1);
}

console.log(`OK — rendered ${files.length} twig templates`);
