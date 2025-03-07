const path = require("path");
const child = require("child_process");
const sass = require("sass-embedded"); // eslint-disable-line import/no-extraneous-dependencies

exports.distPath = path.resolve("./dist");
exports.distCssPath = path.join(exports.distPath, "css");
exports.distScssPath = path.join(exports.distPath, "scss");
exports.runGulp = (task) =>
  new Promise((resolve, reject) => {
    child
      .spawn("./node_modules/.bin/gulp", [task], { stdio: "ignore" })
      .on("error", reject)
      .on("exit", () => resolve());
  });

/**
 * Compiles a string of scss styles to css
 * @param {string} styles - Scss style definitions to compile into css
 * @param {*} loadPaths - Paths in which to look for stylesheets loaded by rules like @use and @import.
 */
exports.compileString = (styles, loadPaths) => {
  sass.compileString(styles, {
    loadPaths,
    silenceDeprecations: ["mixed-decls"],
  });
};

/**
 * Compiles a scss file to css
 * @param {string} file - Path to file to compile into css
 * @param {*} loadPaths - Paths in which to look for stylesheets loaded by rules like @use and @import.
 */
exports.compile = (file, loadPaths) => {
  sass.compile(file, {
    loadPaths,
    silenceDeprecations: ["mixed-decls"],
  });
};
