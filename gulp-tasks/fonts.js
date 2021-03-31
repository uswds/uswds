const {src, dest} = require("gulp");
const dutil = require("./utils/doc-util");

module.exports = {
  fonts(done) {
    dutil.logMessage("fonts", "Copying Fonts");
    const stream = src("src/fonts/**/*").pipe(dest("dist/fonts"));

    done();
    return stream;
  }
}
