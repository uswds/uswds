/* eslint-disable arrow-body-style */
const { src, dest } = require("gulp");
const svgSprite = require("gulp-svg-sprite");

const svgPath = "../src/img";

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
    return src(`${svgPath}/usa-icons/**/*.svg`)
      .pipe(svgSprite(config))
      // eslint-disable-next-line no-console
      .on("error", (error) => console.error("There was an error", error))
      .pipe(dest(`${svgPath}`))
      .on("end", () => done())
  }
}
