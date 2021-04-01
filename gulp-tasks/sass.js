const { formatters } = require("stylelint");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const discardComments = require("postcss-discard-comments");
const filter = require("gulp-filter");
const { src, dest } = require("gulp");
const gulpStylelint = require("gulp-stylelint");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const sass = require("gulp-dart-scss");
const sourcemaps = require("gulp-sourcemaps");
const changed = require("gulp-changed");
const dutil = require("./utils/doc-util");
const pkg = require("../package.json");

const normalizeCssFilter = filter("**/normalize.css", { restore: true });

sass.compiler = require("sass");

const IGNORE_STRING = "This file is ignored";
const ignoreStylelintIgnoreWarnings = (lintResults) =>
  formatters.string(
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

module.exports = {
  stylelint(done) {
    src("./src/patterns/stylesheets/**/*.scss")
      .pipe(
        gulpStylelint({
          failAfterError: true,
          reporters: [
            {
              formatter: ignoreStylelintIgnoreWarnings,
              console: true,
            },
          ],
          syntax: "scss",
        })
      )
      .on("error", dutil.logError);
      return done();
  },

  copyVendorSass() {
    dutil.logMessage("copyVendorSass", "Compiling vendor CSS");

    const source = "./node_modules/normalize.css/normalize.css";
    const destination = "src/stylesheets/lib";

    const stream = src([source])
      .pipe(normalizeCssFilter)
      .pipe(rename("_normalize.scss"))
      .pipe(changed(destination))
      .on("error", (error) => {
        dutil.logError("copyVendorSass", error);
      })
      .pipe(dest(destination));

    return stream;
  },

  copyDistSass() {
    dutil.logMessage("copyDistSass", "Copying all Sass to dist dir");

    return src("src/patterns/stylesheets/**/*.scss").pipe(dest("dist/scss"));
  },

  sass() {
    dutil.logMessage("sass", "Compiling Sass");
    const pluginsProcess = [discardComments(), autoprefixer()];
    const pluginsMinify = [csso({ forceMediaMerge: false })];

    return src("src/patterns/stylesheets/uswds.scss")
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(
        sass({
            outputStyle: "expanded",
          })
          .on("error", () => sass.logError)
      )
      .pipe(postcss(pluginsProcess))
      .pipe(replace(/\buswds @version\b/g, `uswds v${pkg.version}`))
      .pipe(dest("dist/css"))
      .pipe(postcss(pluginsMinify))
      .pipe(
        rename({
          suffix: ".min",
        })
      )
      .pipe(sourcemaps.write("."))
      .pipe(dest("dist/css"));
  },
};
