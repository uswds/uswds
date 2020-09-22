const log = require("fancy-log");
const colors = require("ansi-colors");
const notifier = require("node-notifier");
const pkg = require("../../package.json");

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

function notify(title, message, wait) {
  notifier.notify({
    title,
    message,
    icon: "src/img/favicons/favicon-192.png",
    wait,
    timeout: false,
  });
}

module.exports = {
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
    notify(`${this.dirName} gulp ${name}`, message, true);
  },

  logMessage(name, message) {
    log(colors.cyan(name), colors.green(message));
    notify(`${this.dirName} gulp ${name}`, message, false);
  },
};
