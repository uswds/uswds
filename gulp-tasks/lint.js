const { formatters } = require("stylelint");
const stylelint = require("stylelint");

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
};
