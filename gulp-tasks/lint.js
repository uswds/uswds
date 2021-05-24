const { src } = require('gulp');
const { formatters } = require("stylelint");
const gulpStylelint = require('gulp-stylelint');
const eslint = require('gulp-eslint');
const dutil = require('./utils/doc-util');

const IGNORE_STRING = "This file is ignored";

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

module.exports = {
  // Lint Sass based on .stylelintrc.json config.
  lintSass () {
    const stylelintOptions = {
      failAfterError: true,
      reporters: [
        {
          formatter: ignoreStylelintIgnoreWarnings,
          console: true,
        },
      ],
      syntax: "scss",
    };

    return src("./src/patterns/stylesheets/**/*.scss")
    .pipe(gulpStylelint(stylelintOptions))
    .on("error", dutil.logError);
  },

  // Lint JavaScript based on .eslintrc config.
  lintJS () {
    return src(['src/patterns/**/**/*.js'])
      .pipe(eslint({ fix: true }))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  }
};
