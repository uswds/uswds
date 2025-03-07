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

exports.render = (data, includePaths) =>
  new Promise((resolve, reject) => {
    sass.renderSync(
      {
        data,
        includePaths,
      },
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    );
  });
