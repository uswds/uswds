const path = require("path");
const sassTrue = require("sass-true");

const SASS = path.join(__dirname, "tests.scss");

sassTrue.runSass(
  { file: SASS, includePaths: ["./packages"] },
  { describe, it },
);
