const { src } = require("gulp");
const mocha = require("gulp-spawn-mocha");

const mochaConfig = {
  config: "src/patterns/utils/test/.mocharc.json",
};

// Export our tasks.
module.exports = {
  // run unit test.
  unitTests() {
    return src("src/patterns/**/*.spec.js").pipe(mocha(mochaConfig));
  },

  sassTests() {
    return src("src/patterns/stylesheets/test/sass-spec.js")
      .pipe(mocha());
  },

  a11y() {
    return src("src/patterns/utils/test/a11y.js").pipe(mocha(mochaConfig));
  },

  cover() {
    return src("src/patterns/**/*.spec.js")
      .pipe(mocha(mochaConfig, { nyc: true }));
  },
};
