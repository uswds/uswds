const {src, dest} = require("gulp");
const dutil = require("./utils/doc-util");

module.exports = {
  images() {
    dutil.logMessage("images", "Copying Images");

    return src("src/img/**/*").pipe(dest("dist/img"));
  }
}
