const server = require("browser-sync").create("USWDS");
const run = require("gulp-run-command").default;
const dutil = require("./utils/doc-util");

// See https://browsersync.io/docs/options for more options.
const serverOptions = {
  server: ["./build/"],
  notify: false,
  open: false,
  ui: false,
  logPrefix: "USWDS Server",
  logConnections: true,
  port: 3333
}

/**
 * ! Cache doesn't clear in patternlab like you would expect
 * https://github.com/pattern-lab/patternlab-node/wiki/Incremental-Builds#possible-issues
 * So we rebuild with the patternlab cli, which seems to be working for now
 */
async function rebuildPL() {
  return run("npm run pl:build --pattern")();
}

async function buildPL() {
  return run("npm run pl:build")();
}

/**
 * Used in a11y task in `test.js` to exit server.
 */
async function exitServer() {
  dutil.logMessage("exitServer", "Exiting Server");
  return server.exit();
}

function serve(done) {
  dutil.logMessage("serve", "Starting server");

  server.init(serverOptions);

  done();
}

module.exports = {
  serve,
  server,
  buildPL,
  rebuildPL,
  exitServer,
}
