const log = require("fancy-log");
const colors = require("ansi-colors");
const pkg = require("../package.json");

const shellPrefix = "$";

module.exports = {

  pkg: {
    name: pkg.name,
    version: pkg.version,
  },

  dirName: `${pkg.name}-${pkg.version}`,

  // Introduction.
  logIntroduction(done) {
    log(colors.yellow(`${pkg.name.toUpperCase()} v${pkg.version}`));
    log(colors.white(""));
    log(colors.white("* * * * * ========================"));
    log(colors.white("* * * * * ========================"));
    log(colors.white("* * * * * ========================"));
    log(colors.white("* * * * * ========================"));
    log(colors.white("=================================="));
    log(colors.white("=================================="));
    log(colors.white("=================================="));
    log(colors.white(""));
    done();
  },

  // Clean
  logClean(done) {
    log(shellPrefix, colors.cyan('clean dist'), colors.magenta('cleaning dist folders.'));
    done();
  }

};
