const { formatters } = require("stylelint");
const childProcess = require("child_process");
const stylelint = require("stylelint");
const dutil = require("./utils/doc-util");

const IGNORE_STRING = "This file is ignored";
const PROJECT_SASS_SRC = "src/stylesheets";

function ignoreStylelintIgnoreWarnings(lintResults) {
  return formatters.string(
    lintResults.reduce((memo, result) => {
      const { warnings } = result;
      const fileIsIgnored = warnings.some((warning) =>
        RegExp(IGNORE_STRING, "i").test(warning.text)
      );

      if (!fileIsIgnored) {
        memo.push(result);
      }

      return memo;
    }, [])
  );
}

function typecheck() {
  return new Promise((resolve, reject) => {
    childProcess
      .spawn("./node_modules/.bin/tsc", { stdio: "inherit" })
      .on("error", reject)
      .on("exit", (code) => {
        if (code === 0) {
          dutil.logMessage("typecheck", "TypeScript likes our code!");
          resolve();
        } else {
          reject(new Error("TypeScript failed, see output for details!"));
        }
      });
  });
};

async function lintSass(callback) {
  const { errored, output } = await stylelint.lint({
    files: [
      `${PROJECT_SASS_SRC}/**/*.scss`,
      `!${PROJECT_SASS_SRC}/uswds/**/*.scss`,
    ],
    formatter: "string",
  });

  callback(errored ? new Error(output) : null);
}

module.exports = {
  lintSass,
  typecheck
};
