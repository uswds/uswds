/* eslint-disable arrow-body-style */
const { src, dest } = require("gulp");
const svgSprite = require("gulp-svg-sprite");

const svgPath = "../src/img";

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

// More complex configuration example
const config = {
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
    symbol: true,
  },
};

module.exports = {
  buildSprite(done) {
    return (
      src(`${svgPath}/usa-icons/**/*.svg`)
        .pipe(svgSprite(config))
        .on("error", handleError)
        .pipe(dest(`${svgPath}`))
        .on("end", () => done())
    );
  }
}
