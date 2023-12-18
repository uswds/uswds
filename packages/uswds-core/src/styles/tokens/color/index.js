const { readdirSync, statSync } = require("fs");

const { join } = require("path");

const dirs = (p) =>
  readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());
module.exports = dirs(__dirname);
