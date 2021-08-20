const { src, lastRun } = require('gulp');
const { formatters } = require("stylelint");
const gulpStylelint = require('gulp-stylelint');
const eslint = require('gulp-eslint');
const dutil = require('./utils/doc-util');
const cFlags = require("./utils/cflags");

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

// Lint Sass based on .stylelintrc.json config.
function lintSass() {
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

  return src(
    "./src/stylesheets/**/*.scss",
    { since: lastRun(lintSass) }
  )
  .pipe(gulpStylelint(stylelintOptions))
  .on('error', function handleError(error) {
    dutil.logError(error);
    this.emit('end');
  });
}

function lintJS(done) {
  if (!cFlags.test) {
    dutil.logMessage("eslint", "Skipping linting of JavaScript files.");
    return done();
  }

  return src(["src/**/**/*.js"])
    .pipe(
      eslint({
        fix: true,
      })
    )
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

module.exports = {
  lintSass,
  lintJS
};
