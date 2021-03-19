/* eslint-disable arrow-body-style */

// Include gulp
const { src, dest } = require("gulp");

// Include Our Plugins
const autoprefixer = require("autoprefixer");
const browserify = require("browserify");
const buffer = require("vinyl-buffer");
const csso = require("postcss-csso");
const discardComments = require("postcss-discard-comments");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const sass = require("gulp-sass");
const source = require("vinyl-source-stream");
const sourcemaps = require("gulp-sourcemaps");
const svgSprite = require("gulp-svg-sprite");
const uglify = require("gulp-uglify");
const pkg = require("../package.json");

// Initialize Plugins
const pluginsProcess = [discardComments(), autoprefixer()];
const pluginsMinify = [csso({ forceMediaMerge: false })];

// Set sass compiler to use Dart Sass
sass.compiler = require("sass");

// More complex configuration example
const svgConfig = {
  shape: {
    dimension: {
      // Set maximum dimensions
      maxWidth: 24,
      maxHeight: 24,
    },
    id: {
      separator: "-",
    },
    spacing: {
      // Add padding
      padding: 0,
    },
  },
  mode: {
    symbol: {
      sprite: "../sprite.svg",
    },
  },
};

/**
 * Error handler function so we can see when errors happen.
 * @param {object} err error that was thrown
 * @returns {undefined}
 */
function handleError(err) {
  // eslint-disable-next-line no-console
  console.error(err.toString());
  this.emit("end");
}

// Export our tasks.
module.exports = {
  // Compile Sass.
  compileSass() {
    return src("src/patterns/stylesheets/uswds.scss")
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(sass.sync({ outputStyle: "expanded" }).on("error", handleError))
      .pipe(postcss(pluginsProcess))
      .pipe(replace(/\buswds @version\b/g, `uswds v${pkg.version}`))
      .pipe(dest("dist/css"))
      .pipe(postcss(pluginsMinify))
      .pipe(rename({ suffix: ".min" }))
      .pipe(sourcemaps.write("."))
      .pipe(dest("dist/css"));
  },

  // Compile Sprite.
  compileSprite() {
    return src("src/img/usa-icons/**/*.svg")
      .pipe(svgSprite(svgConfig))
      .on("error", handleError)
      .pipe(dest("src/img"));
  },

  // Compile JavaScript.
  compileJS(done) {
    const entryPoints = ["src/patterns/start.js", "src/patterns/uswds-init.js"];

    const defaultStreams = entryPoints.map((entry) => {
      return browserify({
        entries: [entry],
        debug: true,
      }).transform("babelify", {
        global: true,
        presets: ["@babel/preset-env"],
      });
    });

    const streams = defaultStreams.map((stream, i) => {
      const BASENAME = i === 0 ? "uswds" : "uswds-init";
      return stream
        .bundle()
        .pipe(source(`${BASENAME}.js`)) // XXX why is this necessary?
        .pipe(buffer())
        .pipe(rename({ basename: BASENAME }))
        .pipe(dest("dist/js"));
    });

    streams.map((stream) => {
      return stream
        .pipe(sourcemaps.init({ loadMaps: true }))
        .on("error", handleError)
        .pipe(uglify())
        .pipe(
          rename({
            suffix: ".min",
          })
        )
        .pipe(sourcemaps.write("."))
        .pipe(dest("dist/js"));
    });

    done();
    return streams;
  },
};
