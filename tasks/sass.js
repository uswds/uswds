const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const discardComments = require("postcss-discard-comments");
const { src, dest } = require("gulp");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass-embedded"));
const sourcemaps = require("gulp-sourcemaps");
const dutil = require("./utils/doc-util");
const pkg = require("../package.json");

module.exports = {
  compileSass() {
    dutil.logMessage("sass", "Compiling Sass");
    const pluginsProcess = [discardComments(), autoprefixer()];
    const pluginsMinify = [csso({ forceMediaMerge: false })];

    return src("src/stylesheets/uswds.scss")
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(
        sass({
          loadPaths: ["./packages"],
          style: "expanded",
        }).on("error", function handleError(error) {
          dutil.logError(error);
          this.emit("end");
        }),
      )
      .pipe(postcss(pluginsProcess))
      .pipe(replace(/\buswds @version\b/g, `uswds v${pkg.version}`))
      .pipe(dest("dist/css"))
      .pipe(postcss(pluginsMinify))
      .pipe(
        rename({
          suffix: ".min",
        }),
      )
      .pipe(sourcemaps.write("."))
      .pipe(dest("dist/css"));
  },
};
