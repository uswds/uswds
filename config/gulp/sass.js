const { formatters } = require("stylelint");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const discardComments = require("postcss-discard-comments");
const gulp = require("gulp");
const gulpStylelint = require("gulp-stylelint");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const dutil = require("./doc-util");
const pkg = require("../../package.json");

const task = "sass";

sass.compiler = require("sass");

const IGNORE_STRING = "This file is ignored";
const ignoreStylelintIgnoreWarnings = lintResults =>
  formatters.string(
    lintResults.reduce((memo, result) => {
      const { warnings } = result;
      const fileIsIgnored = warnings.some(warning =>
        RegExp(IGNORE_STRING, "i").test(warning.text)
      );

      if (!fileIsIgnored) {
        memo.push(result);
      }

      return memo;
    }, [])
  );

gulp.task("stylelint", () =>
  gulp
    .src("./src/**/*.scss")
    .pipe(
      gulpStylelint({
        failAfterError: true,
        reporters: [
          {
            formatter: ignoreStylelintIgnoreWarnings,
            console: true
          }
        ],
        syntax: "scss"
      })
    )
    .on("error", dutil.logError)
);

gulp.task("copy-dist-sass", () => {
  dutil.logMessage("copy-dist-sass", "Copying all Sass to dist dir");

  const stream = gulp
    .src(["src/_patterns/**/*.scss","src/*.scss"])
    .pipe(gulp.dest("dist/scss"));

  return stream;
});

gulp.task('rename-dist-sass', () => {
  dutil.logMessage("rename-dist-sass", "Renaming Sass Patterns");

  return gulp.src(['dist/scss/uswds.scss'])
    .pipe(replace('_patterns/', ''))
    .pipe(gulp.dest("dist/scss"));
});

gulp.task("sass", () => {
  dutil.logMessage(task, "Compiling Sass");
  const pluginsProcess = [discardComments(), autoprefixer()];
  const pluginsMinify = [csso({ forceMediaMerge: false })];

  return gulp
    .src(['src/uswds.scss','src/pattern-scaffolding.scss'])
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(sass.sync({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(postcss(pluginsProcess))
    .pipe(replace(/\buswds @version\b/g, `uswds v${pkg.version}`))
    .pipe(gulp.dest("dist/css"))
    .pipe(postcss(pluginsMinify))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"));
});
