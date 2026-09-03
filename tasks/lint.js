const { formatters } = require("stylelint");
const stylelint = require("stylelint");

const IGNORE_STRING = "This file is ignored";
const PROJECT_SASS_SRC = "./packages";

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

async function lintSass(callback) {
  const { errored, report } = await stylelint.lint({
    files: [
      `${PROJECT_SASS_SRC}/**/*.scss`,
      `!${PROJECT_SASS_SRC}/uswds/**/*.scss`,
      `!${PROJECT_SASS_SRC}/uswds-elements/lib/**/*.scss`,
    ],
    formatter: "string",
  });

  callback(errored ? new Error(report) : null);
}

module.exports = {
  lintSass,
};
