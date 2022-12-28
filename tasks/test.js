import gulp from "gulp";
import mocha from "gulp-mocha";

const { src } = gulp;
const mochaConfig = {
  config: "packages/uswds-core/src/js/utils/test/.mocharc.json",
};

const unitTests = () =>
  src("packages/usa-banner/src/test/banner.spec.js").pipe(mocha(mochaConfig));

const sassTests = () =>
  src("packages/uswds-core/src/test/sass.spec.js").pipe(mocha());

export { unitTests, sassTests };
