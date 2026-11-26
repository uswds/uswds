const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const discardComments = require("postcss-discard-comments");
const { src, dest } = require("gulp");
const { pipeline } = require("node:stream/promises");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass-embedded"));
const sourcemaps = require("gulp-sourcemaps");
const dutil = require("./utils/doc-util");
const pkg = require("../package.json");

function compileSass() {
  dutil.logMessage("sass", "Compiling Sass");
  const pluginsProcess = [discardComments(), autoprefixer()];
  const pluginsMinify = [csso({ forceMediaMerge: false })];

  // Forward errors from every stage to Gulp instead of ending the Sass stream
  // successfully when compilation fails.
  return pipeline(
    src("src/stylesheets/uswds.scss"),
    sourcemaps.init({ largeFile: true }),
    sass({
      loadPaths: ["./packages"],
      style: "expanded",
    }),
    postcss(pluginsProcess),
    replace(/\buswds @version\b/g, `uswds v${pkg.version}`),
    dest("dist/css"),
    postcss(pluginsMinify),
    rename({ suffix: ".min" }),
    sourcemaps.write("."),
    dest("dist/css"),
  );
}

function compileSassForWatch() {
  // An invalid edit should be visible without stopping subsequent watch runs.
  // Release and one-shot builds always use compileSass directly.
  return compileSass().catch((error) => {
    dutil.logError("sass", error.message);
  });
}

module.exports = {
  compileSass,
  compileSassForWatch,
};
