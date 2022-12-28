import log from "fancy-log";
import colors from "ansi-colors";
import pkg from "../../package.json" assert { type: "json" };

const shellPrefix = "$";

function drawFlag() {
  log(colors.white(""));
  log(colors.white("* * * * * ========================"));
  log(colors.white("* * * * * ========================"));
  log(colors.white("* * * * * ========================"));
  log(colors.white("* * * * * ========================"));
  log(colors.white("=================================="));
  log(colors.white("=================================="));
  log(colors.white("=================================="));
  log(colors.white(""));
}

// This default export approach doesn't support tree-shaking
// Should split out into exported named functions
export default {
  pkg: {
    name: pkg.name,
    version: pkg.version,
  },

  dirName: `${pkg.name}-${pkg.version}`,

  logIntroduction(message) {
    const introMessage = message || "USWDS";
    log(colors.yellow(`${introMessage} v${pkg.version}`));
    drawFlag();
  },

  logCommand(name, message) {
    log(shellPrefix, colors.cyan(name), colors.magenta(message));
  },

  logHelp(name, message) {
    log(shellPrefix, colors.cyan(name), colors.yellow(message));
  },

  logData(name, message) {
    log(colors.cyan(name), colors.yellow(message));
  },

  logError(name, message) {
    log(colors.red(name), colors.yellow(message));
  },

  logMessage(name, message) {
    log(colors.cyan(name), colors.green(message));
  },
};
