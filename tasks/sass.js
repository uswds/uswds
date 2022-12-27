import gulp from "gulp";
import autoprefixer from "autoprefixer";
import csso from "postcss-csso";
import discardComments from "postcss-discard-comments";
import postcss from "gulp-postcss";
import replace from "gulp-replace";
import rename from "gulp-rename";
import gulpSass from "gulp-sass";
// import sourcemaps from "gulp-sourcemaps";
import sassEmbedded from "sass-embedded";
import dutil from "./utils/doc-util.js";
import pkg from '../package.json' assert { type: 'json' };

const { src, dest } = gulp;

const sass = gulpSass(sassEmbedded);

function compileSass() {
  dutil.logMessage("sass", "Compiling Sass");
  const pluginsProcess = [discardComments(), autoprefixer()];
  const pluginsMinify = [csso({ forceMediaMerge: false })];

  return src("src/stylesheets/uswds.scss", { sourcemaps: true })
    .pipe(
      sass({
        includePaths: [
          "./packages",
        ],
        outputStyle: "expanded",
      }).on("error", function handleError(error) {
        dutil.logError(error);
        this.emit("end");
      })
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
    .pipe(dest("dist/css", { sourcemaps: '.' }));
};

export default compileSass;
