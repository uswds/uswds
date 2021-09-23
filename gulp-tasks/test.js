const { src } = require("gulp");
const mocha = require("gulp-spawn-mocha");

const mochaConfig = {
  config: "src/utils/test/.mocharc.json",
};

// Export our tasks.
module.exports = {
  // run unit test.
  unitTests() {
    return src("src/components/**/*.spec.js").pipe(mocha(mochaConfig));
  },

  sassTests() {
    return src("src/stylesheets/test/sass-spec.js")
      .pipe(mocha());
  },

  cover() {
    return src("src/**/*.spec.js")
      .pipe(mocha(mochaConfig, { nyc: true }));
  },
};
