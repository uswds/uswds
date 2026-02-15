const sass = require("sass-embedded");
const lightningcss = require("lightningcss");
const fs = require("fs");
const path = require("path");
const browserslist = require("browserslist");
const dutil = require("./utils/doc-util");
const pkg = require("../package.json");

const targets = lightningcss.browserslistToTargets(browserslist(pkg.browserslist));
const versionStamp = `uswds v${pkg.version}`;

module.exports = {
  async compileSass() {
    dutil.logMessage("sass", "Compiling Sass");

    const distDir = path.resolve("dist/css");
    fs.mkdirSync(distDir, { recursive: true });

    // Compile Sass
    const result = await sass.compileAsync(
      "src/stylesheets/uswds.scss",
      {
        loadPaths: ["./packages"],
        style: "expanded",
        sourceMap: true,
        sourceMapIncludeSources: true,
      },
    );

    const cssBuffer = Buffer.from(result.css);

    const expanded = lightningcss.transform({
      filename: "uswds.css",
      code: cssBuffer,
      minify: false,
      targets,
    });

    const minified = lightningcss.transform({
      filename: "uswds.min.css",
      code: cssBuffer,
      minify: true,
      sourceMap: true,
      targets,
    });

    // Write all outputs in parallel
    await Promise.all([
      fs.promises.writeFile(path.join(distDir, "uswds.css"), `/* ${versionStamp} */\n\n${expanded.code}`),
      fs.promises.writeFile(path.join(distDir, "uswds.min.css"), `/* ${versionStamp} */\n\n${minified.code}`),
      fs.promises.writeFile(
        path.join(distDir, "uswds.min.css.map"),
        JSON.stringify(minified.map),
      ),
    ]);
  },
};
