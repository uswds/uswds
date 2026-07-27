const path = require("path");
const sassTrue = require("sass-true");
const sass = require("sass-embedded");

const SASS = path.join(__dirname, "tests.scss");

sassTrue.runSass(
  { describe, it, sass },
  SASS,
  { loadPaths: ["./packages", "."] },
);
