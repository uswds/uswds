// Include gulp helpers.
// const { series, parallel } from "gulp";
import gulp from "gulp";
// import { series, parallel } from "gulp";

// Include Our tasks.
//
// Each task is broken apart to it's own node module.
// Check out the ./tasks directory for more.
import flags from "./tasks/flags.js";
import { buildSprite, buildSpriteStandalone } from "./tasks/svg-sprite.js";
import { unitTests, sassTests } from "./tasks/test.js";
import lintSass from "./tasks/lint.js";
import build from "./tasks/build.js";
// import { release } from "./tasks/release";
// import { watch } from "./tasks/watch";
import cleanDist from "./tasks/clean.js";

import { compileJS, typeCheck } from "./tasks/javascript.js";
import compileSass from "./tasks/sass.js";

const { series, parallel } = gulp;

/**
 * *Flags*
 */
const { noTest, noCleanup } = flags;

/**
 * *Lint tasks*
 */
// exports.lintSass = lintSass;
// exports.typecheck = typecheck;
// exports.lint = parallel(lintSass, typecheck);

/**
 * *Test tasks*
 * sassTests: Sass unit tests.
 * unitTests: Component unit tests.
 * test: Run all tests.
 */
// exports.sassTests = sassTests;
// exports.unitTests = unitTests;
const test = series(
  typeCheck,
  lintSass,
  sassTests,
  unitTests,
);

/**
 * *Build tasks*
 * buildSprite: Generate new spritesheet based on SVGs in `src/img/usa-icons/`.
 * buildSass: Lint, copy normalize, and compile sass.
 * buildJS: Lint, copy normalize, and compile sass.
 * release: Builds USWDS and returns a zip with sha256 hash and filesize.
 */
// exports.buildSpriteStandalone = buildSpriteStandalone;
// export { buildSprite };
// export const buildSass = series(lintSass, compileSass);
// export const buildSass = compileSass;
const buildJS = series(typeCheck, compileJS);
// export { build as buildUSWDS };
// exports.release = release;

// export default compileSass;

/**
 * *Watch task*
 * Builds USWDS and component library, and watches
 * for changes in scss, js, twig, yml, and unit tests.
 */
// exports.watch = watch;

// Default Task
// exports.default = this.buildUSWDS;

export default build;

export {
  lintSass,
  test,
  unitTests,
  noTest,
  noCleanup,
  cleanDist,
  buildSprite,
  buildSpriteStandalone,
  compileSass as buildSass,
  buildJS,
}
