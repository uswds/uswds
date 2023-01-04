import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import child from "child_process";
import sass from "sass-embedded"; // eslint-disable-line import/no-extraneous-dependencies

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

exports.distPath = path.resolve(path.join(__dirname, "../../../dist"));
exports.distCssPath = path.join(exports.distPath, "css");
exports.distScssPath = path.join(exports.distPath, "scss");
exports.runGulp = (task) =>
  new Promise((resolve, reject) => {
    child
      .spawn("./node_modules/.bin/gulp", [task], { stdio: "ignore" })
      .on("error", reject)
      .on("exit", () => resolve());
  });

const render = (data, includePaths) =>
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
      }
    );
  });

export default render;
